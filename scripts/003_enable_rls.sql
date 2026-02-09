-- Enable Row Level Security

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can view approved testimonials" ON testimonials
  FOR SELECT USING (approved = true);

CREATE POLICY "Public can view FAQs" ON faqs
  FOR SELECT USING (true);

-- Anyone can insert bookings (we'll validate in the app)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only service role can update/delete (for admin panel)
CREATE POLICY "Service role can manage bookings" ON bookings
  FOR ALL USING (true);

CREATE POLICY "Service role can manage blog posts" ON blog_posts
  FOR ALL USING (true);

CREATE POLICY "Service role can manage testimonials" ON testimonials
  FOR ALL USING (true);

CREATE POLICY "Service role can manage FAQs" ON faqs
  FOR ALL USING (true);
