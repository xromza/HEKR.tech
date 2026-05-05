-- V6__Update_Mock_Data.sql

BEGIN;

-- 1. Очистка всех таблиц со сбросом IDENTITY
TRUNCATE TABLE 
    public.order_status_history, 
    public.order_items, 
    public.orders, 
    public.carts, 
    public.user_tokens, 
    public.individual_details, 
    public.legal_details, 
    public.users, 
    public.stock, 
    public.images, 
    public.product_variants, 
    public.products, 
    public.discounts, 
    public.categories, 
    public.warehouses 
RESTART IDENTITY CASCADE;

-- 2. Категории (строго по ТЗ)
INSERT INTO public.categories (id, name) VALUES
(1, 'Мужская одежда'),
(2, 'Женская одежда'),
(3, 'Аксессуары'),
(4, 'Обувь');

-- 3. Скидки на категории
INSERT INTO public.discounts (category_id, discount) VALUES
(3, 0.05),
(4, 0.03);

-- 4. Склады (6 локаций по РФ)
INSERT INTO public.warehouses (id, address) VALUES
(1, 'г. Москва, ул. Петровка, д. 2 (Центральный хаб)'),
(2, 'г. Санкт-Петербург, Невский пр., д. 15 (Северный хаб)'),
(3, 'г. Казань, ул. Баумана, д. 44 (Поволжье)'),
(4, 'г. Новосибирск, Красный пр., д. 100 (Сибирь)'),
(5, 'г. Сочи, ул. Навагинская, д. 8 (Южный регион)'),
(6, 'г. Екатеринбург, ул. Вайнера, д. 12 (Урал)');

-- 5. Товары (Luxury-сегмент, пороги опта 2-5 шт.)
INSERT INTO public.products (id, category_id, title, description, price_retail, price_wholesale, wholesale_threshold, is_active, brand) VALUES
(1, 1, 'Бомбер GG Marmont', 'Классический бомбер из технической ткани с вышивкой и нашивкой.', 185000.00, 140000.00, 3, true, 'Gucci'),
(2, 1, 'Рубашка из поплина', 'Хлопковая рубашка классического кроя с треугольным логотипом.', 72000.00, 52000.00, 4, true, 'Prada'),
(3, 1, 'Пуховик Maya', 'Культовый короткий пуховик с лаковым покрытием и съемным капюшоном.', 265000.00, 195000.00, 2, true, 'Moncler'),
(4, 2, 'Деконструированное платье', 'Шерстяное платье-свитер с необработанными краями и асимметричным подолом.', 155000.00, 110000.00, 3, true, 'Maison Margiela'),
(5, 2, 'Костюм из шерсти Super 120', 'Двубортный пиджак и брюки классического кроя, итальянская шерсть.', 210000.00, 150000.00, 2, true, 'Gucci'),
(6, 2, 'Юбка из Re-Nylon', 'Юбка миди из переработанного нейлона с эмалированной эмблемой.', 95000.00, 68000.00, 4, true, 'Prada'),
(7, 3, 'Ремень GG Marmont 4 см', 'Кожаный ремень с двойной пряжкой G и эффектом состаренности.', 48000.00, 35000.00, 5, true, 'Gucci'),
(8, 3, 'Клатч Saffiano', 'Миниатюрный клатч из текстурированной кожи с золотой фурнитурой.', 78000.00, 55000.00, 3, true, 'Prada'),
(9, 4, 'Кроссовки Replica', 'Замшевые кроссовки с нарисованным логотипом и резиновой подошвой.', 68000.00, 48000.00, 4, true, 'Maison Margiela'),
(10, 4, 'Ботинки Trailgrip', 'Водонепроницаемые треккинговые ботинки с мембраной и карбоновой вставкой.', 105000.00, 75000.00, 3, true, 'Moncler');

-- 6. Варианты товаров (29 SKU)
INSERT INTO public.product_variants (id, product_id, size, color, weight, sku, is_active) VALUES
(1, 1, 'M', 'Черный', 0.90, 'GUC-BMB-BLK-M', true),
(2, 1, 'L', 'Черный', 0.95, 'GUC-BMB-BLK-L', true),
(3, 1, 'XL', 'Темно-синий', 1.00, 'GUC-BMB-NVY-XL', true),
(4, 2, '39', 'Белый', 0.25, 'PRA-SHT-WHT-39', true),
(5, 2, '40', 'Белый', 0.26, 'PRA-SHT-WHT-40', true),
(6, 2, '41', 'Голубой', 0.27, 'PRA-SHT-BLU-41', true),
(7, 3, '2', 'Черный', 1.40, 'MNC-MYA-BLK-2', true),
(8, 3, '3', 'Черный', 1.45, 'MNC-MYA-BLK-3', true),
(9, 3, '4', 'Темно-синий', 1.50, 'MNC-MYA-NVY-4', true),
(10, 4, 'XS', 'Бежевый', 0.60, 'MM-DRS-BEG-XS', true),
(11, 4, 'S', 'Бежевый', 0.65, 'MM-DRS-BEG-S', true),
(12, 4, 'M', 'Черный', 0.70, 'MM-DRS-BLK-M', true),
(13, 5, '46', 'Черный', 1.80, 'GUC-SUT-BLK-46', true),
(14, 5, '48', 'Черный', 1.85, 'GUC-SUT-BLK-48', true),
(15, 5, '50', 'Темно-синий', 1.90, 'GUC-SUT-NVY-50', true),
(16, 6, '38', 'Черный', 0.40, 'PRA-SKT-BLK-38', true),
(17, 6, '40', 'Черный', 0.42, 'PRA-SKT-BLK-40', true),
(18, 6, '42', 'Темно-синий', 0.45, 'PRA-SKT-NVY-42', true),
(19, 7, '85', 'Черный', 0.30, 'GUC-BLT-BLK-85', true),
(20, 7, '90', 'Черный', 0.32, 'GUC-BLT-BLK-90', true),
(21, 7, '95', 'Коричневый', 0.34, 'GUC-BLT-BRN-95', true),
(22, 8, 'ONE SIZE', 'Черный', 0.25, 'PRA-CLT-BLK-OS', true),
(23, 8, 'ONE SIZE', 'Бордовый', 0.25, 'PRA-CLT-BRD-OS', true),
(24, 9, '41', 'Белый/Серый', 0.80, 'MM-REP-WGR-41', true),
(25, 9, '42', 'Белый/Серый', 0.85, 'MM-REP-WGR-42', true),
(26, 9, '43', 'Черный', 0.90, 'MM-REP-BLK-43', true),
(27, 10, '41', 'Черный', 1.20, 'MNC-TRG-BLK-41', true),
(28, 10, '42', 'Черный', 1.25, 'MNC-TRG-BLK-42', true),
(29, 10, '43', 'Темно-серый', 1.30, 'MNC-TRG-DGR-43', true);

-- 7. Изображения (MAIN, THUMBNAIL, GALLERY)
INSERT INTO public.images (id, url, variant_id, type, sort_order, created_at) VALUES
(1, 'https://lux-cdn.example.com/gucci_bomber_blk_main.jpg', 1, 'MAIN', 0, NOW()),
(2, 'https://lux-cdn.example.com/gucci_bomber_blk_thumb.jpg', 1, 'THUMBNAIL', 0, NOW()),
(3, 'https://lux-cdn.example.com/gucci_bomber_blk_back.jpg', 1, 'GALLERY', 1, NOW()),
(4, 'https://lux-cdn.example.com/prada_shirt_wht_main.jpg', 4, 'MAIN', 0, NOW()),
(5, 'https://lux-cdn.example.com/prada_shirt_wht_thumb.jpg', 4, 'THUMBNAIL', 0, NOW()),
(6, 'https://lux-cdn.example.com/moncler_maya_blk_main.jpg', 7, 'MAIN', 0, NOW()),
(7, 'https://lux-cdn.example.com/moncler_maya_blk_detail.jpg', 7, 'GALLERY', 1, NOW()),
(8, 'https://lux-cdn.example.com/margiela_dress_beg_main.jpg', 10, 'MAIN', 0, NOW()),
(9, 'https://lux-cdn.example.com/margiela_dress_beg_thumb.jpg', 10, 'THUMBNAIL', 0, NOW()),
(10, 'https://lux-cdn.example.com/gucci_suit_blk_main.jpg', 13, 'MAIN', 0, NOW()),
(11, 'https://lux-cdn.example.com/prada_skirt_blk_main.jpg', 16, 'MAIN', 0, NOW()),
(12, 'https://lux-cdn.example.com/gucci_belt_blk_main.jpg', 19, 'MAIN', 0, NOW()),
(13, 'https://lux-cdn.example.com/prada_clutch_blk_main.jpg', 22, 'MAIN', 0, NOW()),
(14, 'https://lux-cdn.example.com/margiela_replica_main.jpg', 24, 'MAIN', 0, NOW()),
(15, 'https://lux-cdn.example.com/moncler_trailgrip_main.jpg', 27, 'MAIN', 0, NOW());

-- 8. Остатки на 6 складах (малые партии, характерные для люкса)
INSERT INTO public.stock (variant_id, warehouse_id, quantity) VALUES
(1,1,3),(1,2,2),(1,5,1),
(2,1,2),(2,3,1),
(3,2,1),(3,6,1),
(4,1,5),(4,2,4),(4,4,2),
(5,1,4),(5,3,3),
(6,2,3),(6,5,2),
(7,1,2),(7,2,1),
(8,1,3),(8,4,1),
(9,3,1),(9,6,1),
(10,1,2),(10,2,2),
(11,1,3),(11,5,1),
(12,2,2),(12,3,1),
(13,1,1),(13,2,1),
(14,1,2),(14,4,1),
(15,2,1),(15,6,1),
(16,1,4),(16,3,2),
(17,1,3),(17,5,1),
(18,2,2),(18,4,1),
(19,1,8),(19,2,5),(19,3,4),
(20,1,6),(20,4,3),
(21,2,5),(21,5,2),
(22,1,4),(22,2,3),
(23,2,3),(23,6,2),
(24,1,3),(24,3,2),
(25,1,4),(25,5,1),
(26,2,2),(26,4,1),
(27,1,2),(27,2,1),
(28,1,3),(28,6,1),
(29,2,1),(29,3,1);

-- 9. Пользователи (ADMIN, MANAGER, CLIENT | INDIVIDUAL, LEGAL)
-- Хэш пароля: bcrypt для 'password123'
INSERT INTO public.users (id, login, password_hash, role, created_at, is_approved, client_type, phone, email) VALUES
(0, 'system', '0', 'ADMIN', NOW(), false, 'LEGAL', '0', '0'),
(1, 'admin_main', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'ADMIN', NOW(), true, 'INDIVIDUAL', '+74951000001', 'admin@luxboutique.ru'),
(2, 'manager_olga', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'MANAGER', NOW(), true, 'INDIVIDUAL', '+74951000002', 'olga.m@luxboutique.ru'),
(3, 'manager_dmitry', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'MANAGER', NOW(), true, 'INDIVIDUAL', '+74951000003', 'dmitry.m@luxboutique.ru'),
(4, 'client_alexey', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'CLIENT', NOW(), true, 'INDIVIDUAL', '+79161112233', 'alexey@private.com'),
(5, 'client_maria', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'CLIENT', NOW(), true, 'INDIVIDUAL', '+79263334455', 'maria.style@mail.ru'),
(6, 'ooo_luxtrade', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'CLIENT', NOW(), true, 'LEGAL', '+74952223344', 'opt@luxtrade.ru'),
(7, 'ip_fashion', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'CLIENT', NOW(), true, 'LEGAL', '+79034445566', 'zakaz@ipfashion.ru'),
(8, 'client_ivan', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'CLIENT', NOW(), true, 'INDIVIDUAL', '+79155556677', 'ivan.new@yandex.ru'),
(9, 'client_elena', '$2a$10$q1eAwtoUGtKRRHFF/4JyBOzQOGgYdzEQwykqWOdqkBXFQ.nXI4OhK', 'CLIENT', NOW(), true, 'INDIVIDUAL', '+79778889900', 'elena.vip@inbox.ru');

-- 10. Данные физлиц
INSERT INTO public.individual_details (user_id, first_name, last_name, midname, birthdate, passport_series, passport_number) VALUES
(1, 'Александр', 'Управляющий', 'Сергеевич', '1988-04-12', '4510', '111222'),
(2, 'Ольга', 'Менеджерова', 'Андреевна', '1990-06-15', '4520', '333444'),
(3, 'Дмитрий', 'Складов', 'Игоревич', '1985-11-30', '4530', '555666'),
(4, 'Алексей', 'Воронов', 'Игоревич', '1985-11-30', '4540', '777888'),
(5, 'Мария', 'Стилова', 'Андреевна', '1992-07-15', '4550', '999000'),
(8, 'Иван', 'Клиентов', 'Олегович', '1998-09-05', '4560', '112233'),
(9, 'Елена', 'Модная', 'Владимировна', '1995-02-20', '4570', '445566');

-- 11. Данные юрлиц
INSERT INTO public.legal_details (user_id, company_name, inn, kpp, ogrn, legal_address) VALUES
(0, 'SYSTEM LLC', '0000000000', '000000000', '0000000000000', 'System Address'),
(6, 'ООО "Люкс Трейд"', '7710112233', '770101001', '1027700111222', 'г. Москва, Столешников пер., д. 7'),
(7, 'ИП Фэшн Групп', '783055667788', NULL, '3027800555666', 'г. Санкт-Петербург, Б. Конюшенная, д. 12');

-- 12. Корзины
INSERT INTO public.carts (user_id, variant_id, quantity) VALUES
(4, 2, 1), (4, 20, 1),
(5, 11, 1), (5, 23, 1),
(8, 25, 1),
(9, 19, 2);

-- 13. Заказы (price = сумма позиций ниже)
INSERT INTO public.orders (id, user_id, warehouse_id, price, address, status, payment_method, comment, date) VALUES
(1, 4, 1, 370000.00, 'г. Москва, Рублевское шоссе, д. 20, кв. 5', 'COMPLETED', 'CARD', 'Позвонить за час до доставки', NOW() - INTERVAL '12 days'),
(2, 6, 1, 260000.00, 'г. Москва, Столешников пер., д. 7', 'SHIPPED', 'INVOICE', 'Оптовая закупка для шоурума', NOW() - INTERVAL '8 days'),
(3, 5, 2, 330000.00, 'г. Санкт-Петербург, Невский пр., д. 55', 'ASSEMBLING', 'SBP', 'Оставить у консьержа', NOW() - INTERVAL '3 days'),
(4, 8, 1, 96000.00, 'г. Казань, ул. Баумана, д. 10', 'PROCESSING', 'CASH', 'Примерка перед покупкой', NOW() - INTERVAL '1 day'),
(5, 7, 3, 192000.00, 'г. Новосибирск, Красный пр., д. 50', 'CANCELED', 'INVOICE', 'Клиент изменил ассортимент', NOW() - INTERVAL '5 days'),
(6, 9, 5, 265000.00, 'г. Сочи, ул. Навагинская, д. 15', 'NEW', 'CARD', 'Подарочная упаковка Lux', NOW()),
(7, 4, 1, 300000.00, 'г. Москва, Рублевское шоссе, д. 20, кв. 5', 'ASSEMBLED', 'CARD', 'Повторный заказ', NOW() - INTERVAL '2 days'),
(8, 6, 2, 555000.00, 'г. Москва, Столешников пер., д. 7', 'SHIPPING', 'INVOICE', 'Корпоративный заказ, срочно', NOW() - INTERVAL '1 day');

-- 14. Позиции заказов
-- ВАЖНО: price_at_purchase выбирается строго по количеству vs wholesale_threshold продукта
INSERT INTO public.order_items (order_id, variant_id, quantity, price_at_purchase, total_price) VALUES
-- Заказ 1: v1 (P1, порог 3). Qty 2 < 3 -> Retail 185000
(1, 1, 2, 185000.00, 370000.00),
-- Заказ 2: v4 (P2, порог 4). Qty 5 >= 4 -> Wholesale 52000
(2, 4, 5, 52000.00, 260000.00),
-- Заказ 3: v10 (P4, порог 3). Qty 3 >= 3 -> Wholesale 110000
(3, 10, 3, 110000.00, 330000.00),
-- Заказ 4: v19 (P7, порог 5). Qty 2 < 5 -> Retail 48000
(4, 19, 2, 48000.00, 96000.00),
-- Заказ 5: v24 (P9, порог 4). Qty 4 >= 4 -> Wholesale 48000
(5, 24, 4, 48000.00, 192000.00),
-- Заказ 6: v7 (P3, порог 2). Qty 1 < 2 -> Retail 265000
(6, 7, 1, 265000.00, 265000.00),
-- Заказ 7: v13 (P5, порог 2). Qty 2 >= 2 -> Wholesale 150000
(7, 13, 2, 150000.00, 300000.00),
-- Заказ 8: v22 (P8, порог 3). Qty 6 >= 3 -> Wholesale 55000 | v27 (P10, порог 3). Qty 3 >= 3 -> Wholesale 75000
(8, 22, 6, 55000.00, 330000.00),
(8, 27, 3, 75000.00, 225000.00);

-- 15. История статусов (строго по enum: NEW, PROCESSING, ASSEMBLING, ASSEMBLED, SHIPPING, SHIPPED, COMPLETED, CANCELED)
INSERT INTO public.order_status_history (id, order_id, new_status, changed_at, changed_by, comment) VALUES
(1, 1, 'NEW', NOW() - INTERVAL '12 days', 4, 'Заказ создан клиентом'),
(2, 1, 'PROCESSING', NOW() - INTERVAL '11 days', 2, 'Оплата подтверждена'),
(3, 1, 'ASSEMBLING', NOW() - INTERVAL '10 days', 3, 'Передан на сборку'),
(4, 1, 'ASSEMBLED', NOW() - INTERVAL '9 days', 3, 'Собран, ожидает отгрузки'),
(5, 1, 'SHIPPING', NOW() - INTERVAL '8 days', 2, 'Передан курьерской службе'),
(6, 1, 'SHIPPED', NOW() - INTERVAL '7 days', 0, 'В пути к клиенту'),
(7, 1, 'COMPLETED', NOW() - INTERVAL '6 days', 0, 'Успешно доставлен и закрыт'),
(8, 2, 'NEW', NOW() - INTERVAL '8 days', 6, 'Оптовый заказ создан'),
(9, 2, 'PROCESSING', NOW() - INTERVAL '7 days', 2, 'Счет оплачен, резерв на складе'),
(10, 2, 'ASSEMBLING', NOW() - INTERVAL '6 days', 3, 'Комплектация партии'),
(11, 2, 'ASSEMBLED', NOW() - INTERVAL '5 days', 3, 'Готов к отгрузке'),
(12, 2, 'SHIPPING', NOW() - INTERVAL '4 days', 2, 'Отправлен ТК'),
(13, 2, 'SHIPPED', NOW() - INTERVAL '3 days', 0, 'В транзите'),
(14, 3, 'NEW', NOW() - INTERVAL '3 days', 5, 'Заказ создан'),
(15, 3, 'PROCESSING', NOW() - INTERVAL '2 days', 2, 'Оплата через СБП подтверждена'),
(16, 3, 'ASSEMBLING', NOW() - INTERVAL '1 day', 3, 'Сборка на складе СПБ'),
(17, 4, 'NEW', NOW() - INTERVAL '1 day', 8, 'Заказ создан с запросом на примерку'),
(18, 4, 'PROCESSING', NOW(), 2, 'Ожидает подтверждения наличных'),
(19, 5, 'NEW', NOW() - INTERVAL '5 days', 7, 'Оптовый заказ создан'),
(20, 5, 'PROCESSING', NOW() - INTERVAL '4 days', 2, 'Проверка контрагента'),
(21, 5, 'CANCELED', NOW() - INTERVAL '3 days', 2, 'Отменен по запросу партнера'),
(22, 6, 'NEW', NOW(), 9, 'Заказ создан'),
(23, 7, 'NEW', NOW() - INTERVAL '2 days', 4, 'Повторный заказ создан'),
(24, 7, 'PROCESSING', NOW() - INTERVAL '1 day', 2, 'В обработке'),
(25, 7, 'ASSEMBLING', NOW() - INTERVAL '12 hours', 3, 'Подбор размеров'),
(26, 7, 'ASSEMBLED', NOW() - INTERVAL '6 hours', 3, 'Упакован'),
(27, 8, 'NEW', NOW() - INTERVAL '1 day', 6, 'Корпоративный заказ'),
(28, 8, 'PROCESSING', NOW() - INTERVAL '20 hours', 2, 'Срочная обработка'),
(29, 8, 'ASSEMBLING', NOW() - INTERVAL '15 hours', 3, 'Ускоренная сборка'),
(30, 8, 'ASSEMBLED', NOW() - INTERVAL '10 hours', 3, 'Готов'),
(31, 8, 'SHIPPING', NOW() - INTERVAL '5 hours', 2, 'Передан в логистику');

-- 16. Токены пользователей
INSERT INTO public.user_tokens (id, user_id, token, expiry_date, revoked) VALUES
(1, 1, 'mock_token_admin_001', NOW() + INTERVAL '30 days', false),
(2, 2, 'mock_token_manager_olga_001', NOW() + INTERVAL '14 days', false),
(3, 4, 'mock_token_alexey_001', NOW() + INTERVAL '7 days', false),
(4, 5, 'mock_token_maria_001', NOW() + INTERVAL '7 days', false),
(5, 9, 'mock_token_elena_001', NOW() + INTERVAL '3 days', true);

-- 17. Синхронизация последовательностей с максимальными ID
SELECT setval('public.categories_id_seq', (SELECT MAX(id) FROM public.categories));
SELECT setval('public.products_id_seq', (SELECT MAX(id) FROM public.products));
SELECT setval('public.product_variants_id_seq', (SELECT MAX(id) FROM public.product_variants));
SELECT setval('public.images_id_seq', (SELECT MAX(id) FROM public.images));
SELECT setval('public.warehouses_id_seq', (SELECT MAX(id) FROM public.warehouses));
SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
SELECT setval('public.orders_id_seq', (SELECT MAX(id) FROM public.orders));
SELECT setval('public.order_status_history_id_seq', (SELECT MAX(id) FROM public.order_status_history));
SELECT setval('public.user_tokens_id_seq', (SELECT MAX(id) FROM public.user_tokens));

COMMIT;