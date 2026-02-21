-- 1. เพิ่มสนามแบดมินตัน
INSERT INTO public.courts (name, location_url, price_per_hour)
VALUES 
('สนามแบดพัชชะ (ปากช่อง)', 'https://maps.app.goo.gl/xxx', 250),
('สนามแบดมินตันเทศบาล', 'https://maps.app.goo.gl/yyy', 180);

-- 2. เพิ่มก๊วนแบดมินตันตัวอย่าง (Sessions)
-- เราจะใส่ UUID แบบสุ่มไปก่อนเพื่อให้มันทำงานได้
INSERT INTO public.sessions (
  id, 
  court_id, 
  session_date, 
  start_time, 
  end_time, 
  max_players, 
  cost_per_person, 
  status, 
  description
)
VALUES 
(
  gen_random_uuid(), 
  (SELECT id FROM courts WHERE name = 'สนามแบดพัชชะ (ปากช่อง)' LIMIT 1), 
  CURRENT_DATE + INTERVAL '2 days', 
  '19:00', '21:00', 
  12, 120, 'open', 
  'ก๊วนวันพุธมือใหม่-มือกลาง มาสนุกกันครับ'
),
(
  gen_random_uuid(), 
  (SELECT id FROM courts WHERE name = 'สนามแบดมินตันเทศบาล' LIMIT 1), 
  CURRENT_DATE + INTERVAL '5 days', 
  '18:00', '20:00', 
  8, 100, 'open', 
  'ก๊วนเน้นออกกำลังกายครับผม'
);