-- ============================================
-- LOUNGE ANTICO — Supabase Database Schema
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT DEFAULT 'customer' CHECK (role IN ('owner', 'admin', 'customer')),
  is_vip BOOLEAN DEFAULT FALSE,
  discount_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Site content
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_it TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_it TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price NUMERIC(10,2) DEFAULT 0,
  badge TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery_photos (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'));
$$;

-- Profiles
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin" ON profiles FOR ALL USING (is_admin());

-- Content (public read, admin write)
CREATE POLICY "content_read" ON site_content FOR SELECT USING (true);
CREATE POLICY "content_write" ON site_content FOR ALL USING (is_admin());
CREATE POLICY "menu_cat_read" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "menu_cat_write" ON menu_categories FOR ALL USING (is_admin());
CREATE POLICY "menu_items_read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_write" ON menu_items FOR ALL USING (is_admin());
CREATE POLICY "gallery_read" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "gallery_write" ON gallery_photos FOR ALL USING (is_admin());
CREATE POLICY "testimonials_read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_write" ON testimonials FOR ALL USING (is_admin());

-- Reservations
CREATE POLICY "reservations_read" ON reservations FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "reservations_insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_admin_update" ON reservations FOR UPDATE USING (is_admin());

-- Orders
CREATE POLICY "orders_read" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_update" ON orders FOR UPDATE USING (is_admin());

-- ============================================
-- Seed Data
-- ============================================
INSERT INTO site_content (key, value) VALUES
('hero', '{"backgroundUrl":"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80","subheading":"იტალიური სამზარეულოს ხელოვნება, ქართული სტუმართმოყვარეობის სულით","cta1":"მაგიდის ჯავშანი","cta2":"მენიუს ნახვა"}'),
('about', '{"imageUrl":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80","text1":"2015 წლიდან Antico-ს გუნდი შეუდგა იტალიური სამზარეულოს ქართულ სარბიელზე გაცნობას.","text2":"ყოველი ვახშამი — განსაკუთრებული შეხვედრაა.","yearsLabel":"9+"}'),
('cta', '{"backgroundUrl":"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"}'),
('contact', '{"address":"რუსთაველის გამზ. 12, თბილისი, საქართველო","phone1":"+995 322 123 456","phone2":"+995 599 123 456","email1":"info@antico.ge","email2":"reservations@antico.ge","weekdays":"ორშ–პარ: 12:00–23:00","weekends":"შაბ–კვი: 12:00–00:00","mapUrl":"https://maps.google.com","footerAddress":"რუსთაველის გამზ. 12, თბილისი"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO menu_categories (id, name, name_it, sort_order) VALUES
('starters','სტარტერები','Antipasti',1),
('pasta','პასტა','Pasta',2),
('mains','მთავარი კერძები','Secondi',3),
('desserts','დესერტები','Dolci',4),
('drinks','სასმელები','Bevande',5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, category_id, name, name_it, description, price, badge, sort_order) VALUES
('s1','starters','ბრუსკეტა','Bruschetta','ახალი პომიდვრით, ბაზილიკით და ზეითუნის ზეთით',14,null,1),
('s2','starters','კალამარი','Calamari Fritti','მოხარშული კალმარი ლიმონის სოუსით',22,'popular',2),
('s3','starters','კაპრეზე სალათი','Insalata Caprese','ახალი მოცარელა, პომიდორი, ბაზილიკი',18,null,3),
('p1','pasta','სპაგეტი კარბონარა','Spaghetti Carbonara','გუანჩალე, კვერცხი, პეკორინო',26,'chef',1),
('p2','pasta','ტრიუფელის ტალიატელე','Tagliatelle al Tartufo','შავი ტრიუფელი, კარაქი, პარმეზანი',45,'popular',2),
('p3','pasta','პენე არაბიატა','Penne Arrabbiata','პომიდვრის სოუსი, ნიორი, პეპერონჩინო',22,null,3),
('m1','mains','ბასი გრილზე','Branzino alla Griglia','ხმელთაშუა ზღვის ბასი, ლიმონი, ჯანჯაფილი',52,'popular',1),
('m2','mains','ფილე მინიონი','Filetto di Manzo','საქართველოს საქონლის ხორცი, ტრიუფელის სოუსი',68,'chef',2),
('d1','desserts','ტირამისუ','Tiramisu','კლასიკური იტალიური დესერტი',16,'popular',1),
('d2','desserts','პანა კოტა','Panna Cotta','ვანილი, წითელი კენკრის სოუსი',14,null,2),
('dr1','drinks','ჩაი/ყავა','Tea/Coffee','',6,null,1),
('dr2','drinks','ლიმონათი','Limonata','ახალი ლიმნი, პიტნა',8,null,2),
('dr3','drinks','ღვინო','Vino','',12,null,3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO gallery_photos (id, src, alt, sort_order) VALUES
('g1','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','რესტორნის ინტერიერი',1),
('g2','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80','სასადილო დარბაზი',2),
('g3','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80','კერძი',3),
('g4','https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80','კულინარია',4),
('g5','https://images.unsplash.com/photo-1551183053-bf91798d738f?w=800&q=80','პასტა',5),
('g6','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80','პიცა',6),
('g7','https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=800&q=80','ბარის კარადა',7),
('g8','https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80','ვახშამი',8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, name, text, rating, sort_order) VALUES
('t1','ნინო გ.','საოცარი ატმოსფერო და გემრიელი კერძები. ნამდვილად დავბრუნდები!',5,1),
('t2','გიორგი მ.','Antico-ს ტრიუფელის პასტა საუკეთესოა მთელ ქალაქში.',5,2),
('t3','მარიამ ბ.','სახელდახელი ვახშამი, რომელიც დაუვიწყარი გახდა. მადლობა!',5,3)
ON CONFLICT (id) DO NOTHING;
