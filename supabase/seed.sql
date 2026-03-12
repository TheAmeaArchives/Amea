-- ============================================
-- AMEA ARCHIVES - SEED DATA
-- Run this after schema.sql to populate initial content
-- ============================================

-- Clear existing site_content
DELETE FROM site_content;

-- ============================================
-- HOMEPAGE - ABOUT SECTION
-- ============================================
INSERT INTO site_content (key, value) VALUES
('home_about_heading_1', 'AI.'),
('home_about_heading_2', 'Penicillin.'),
('home_about_heading_3', 'Fire.'),
('home_about_text_1', 'All major innovations in history have at least one thing in common; they are human-centred. And it isn''t a mere coincidence. These are the kinds of innovations which produce real impact. Be it by keeping us warm in Winter; saving hundreds of millions of lives from disease; or even helping in writing essays.'),
('home_about_text_2', 'We are in an era with no precedent in history. Millions of Africans are working all over the continent to produce innovations to tackle our most pressing issues. For these innovations to have any practical relevance, they should be human-centred—"we"-centred. They should be built around the way we—as Africans—think and behave. By doing so, building innovations that matter.'),
('home_about_text_3', 'Unfortunately, building such innovations doesn''t happen naturally. It happens by design. This brings us to our mission; the raison d''être of the Amea Archives:'),
('home_innovation_heading_1', 'Innovation'),
('home_innovation_heading_2', 'Behavioral'),
('home_innovation_heading_3', 'Science.'),
('home_innovation_text', 'Now this begs the question "How?" Our approach to moving forward that mission is threefold. First, we gather all the insights from the sciences of human thinking and behavior. These insights, from experiments in behavioral sciences, are curated to leave only the essentials. Second, we contextualize them. Before we can apply those insights, we need to know how much they apply to us. Individuals and organizations would be able to leverage on this impressive body of knowledge (insights into the behavior of Africans) to guide their efforts in producing innovations that matter. Lastly, we can enable some of these innovators to push their efforts even further by having them consult us and benefit from our expertise.'),
('home_tagline', 'It''s all about insights');

-- ============================================
-- TEAM PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('team_page_title', 'OUR TEAM'),
('team_page_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.'),
('team_hero_text_1', 'Different shades'),
('team_hero_text_2', 'of'),
('team_hero_highlight', 'Red'),
('team_collaborators_title', 'OUR COLLABORATORS'),
('team_collaborators_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents.'),
('team_contributors_title', 'OUR CONTRIBUTORS'),
('team_contributors_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents.'),
('team_supporters_title', 'OUR SUPPORTERS'),
('team_supporters_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents.'),
('team_be_part_title', 'BE PART'),
('team_be_part_text', 'You too can pose your block on this edifice. Just click');

-- ============================================
-- ARCHIVES PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('archives_title', 'How the pyramids were built ( Kind of )'),
('archives_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.');

-- ============================================
-- CHAMBERS
-- ============================================
INSERT INTO site_content (key, value) VALUES
('chamber_i_title', 'Chamber I'),
('chamber_i_subtitle', 'Insights from curated experiments.'),
('chamber_ii_title', 'Chamber II'),
('chamber_ii_subtitle', 'A Virtual Research Center.'),
('chamber_ii_cta', 'Volunteer to participate'),
('chamber_iii_title', 'Chamber III'),
('chamber_iii_subtitle', 'Business and Consultance.');

-- ============================================
-- BLOG PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('blog_title', 'OUR BLOG'),
('blog_subtitle', 'A virtual research center'),
('blog_newsletter_title', 'Join over 100,000 Subscribers to Our Newsletter'),
('blog_newsletter_description', 'Stay updated with the latest insights on behavioral science, innovation, and research from across Africa. Get exclusive content delivered directly to your inbox.');

-- ============================================
-- PROGRAMS PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('programs_title', 'OUR PROGRAMS'),
('programs_subtitle', 'Insights from curated experiments.');

-- ============================================
-- GALLERY PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('gallery_title_1', 'Grand'),
('gallery_title_2', 'Gallery'),
('gallery_description', 'Display of projects built & impact created using our insights.');

-- ============================================
-- CONTACT PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('contact_title', 'CONTACT US'),
('contact_form_title', 'Let''s talk'),
('contact_form_description', 'Have a question, idea, or collaboration in mind? We''d love to hear from you. Fill out the form below and our team will get back to you as soon as possible.'),
('contact_email', 'ameaarchives@gmail.com');

-- ============================================
-- CONTRIBUTORS PAGE
-- ============================================
INSERT INTO site_content (key, value) VALUES
('contributors_title', 'OUR CONTRIBUTORS'),
('contributors_description', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled');

-- ============================================
-- CHAMBER II - BELIEFS (Seeds for chamber_beliefs table)
-- ============================================
DELETE FROM chamber_beliefs;
INSERT INTO chamber_beliefs (title, content, chamber, order_index) VALUES
('OUR BELIEF', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.', 'ii', 1),
('OUR METHOD', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.', 'ii', 2),
('OUR RESULTS', 'We are in 2500 BC, Egypt. About 30,000 of the best craftsmen, sculptors and other skilled workers of the time use their combined talents, knowledge and experience to mold and piece together humble blocks of stones to build up what would be-till today-one of the most majestic structures on Earth: The Great Pyramids.', 'ii', 3);

-- ============================================
-- CHAMBER II - STATS (Seeds for chamber_stats table)
-- ============================================
DELETE FROM chamber_stats;
INSERT INTO chamber_stats (label, value, chamber, order_index) VALUES
('Experiment hub', '06', 'ii', 1),
('Participants volunteered', '47', 'ii', 2),
('Experiment carried', '15', 'ii', 3);

-- ============================================
-- SOCIAL LINKS (stored in site_content)
-- ============================================
INSERT INTO site_content (key, value) VALUES
('social_medium', 'https://medium.com/@ameaarchives'),
('social_instagram', 'https://instagram.com/ameaarchives'),
('social_twitter', 'https://x.com/ameaarchives'),
('social_threads', 'https://threads.net/@ameaarchives'),
('social_whatsapp', 'https://wa.me/yourphonenumber'),
('social_linkedin', 'https://linkedin.com/company/ameaarchives');
