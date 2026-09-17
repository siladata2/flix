-- SilaFlix — 0011: minimal seed data for local development only.
-- Do NOT run this migration against production.
insert into categories (name, slug, description) values
  ('Thriller', 'thriller', 'Tense, high-stakes storytelling'),
  ('Drama', 'drama', 'Character-driven stories'),
  ('Sci-Fi', 'sci-fi', 'Speculative and futuristic worlds'),
  ('Comedy', 'comedy', 'Lighthearted and funny'),
  ('African Cinema', 'african-cinema', 'Stories from across Africa'),
  ('Documentary', 'documentary', 'Non-fiction storytelling')
on conflict (slug) do nothing;

insert into app_settings (setting_key, setting_value) values
  ('site_name', '"SilaFlix"'),
  ('tagline', '"Your World of Entertainment"'),
  ('support_phone', '"+255789661031"'),
  ('support_email', '"support@silaflix.com"'),
  ('support_hours', '"Mon–Sat, 9:00–18:00 EAT"'),
  ('maintenance_mode', 'false')
on conflict (setting_key) do nothing;
