# Спецификация API (v1)

Данный документ описывает эндпоинты для взаимодействия фронтенда с бэкендом на Spring Boot. 

## Базовый URL
`https://hekr.tech/api/v1`

---

## 1. Каталог товаров (Catalog)
Работа с витриной и поиском.

### 1.1. Получить список карточек всех товаров
**Метод:** `GET`  
**Путь:** `/products`  
**Доступ:** Всем  

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=price,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |

**Успешный ответ (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "title": "Худи 'Over-size' Базовое",
      "price_retail": 4500.00,
      "price_wholesale": 3800.00,
      "main_image_url": "https://res.cloudinary.com/hekr/image/upload/v1/products/hoodie_blk_main.jpg",
      "category_id": 5
    },
    {
      "id": 15,
      "title": "Футболка 'Minimalism' Белая",
      "price_retail": 1800.00,
      "price_wholesale": 1400.00,
      "main_image_url": "https://res.cloudinary.com/hekr/image/upload/v1/products/tshirt_white.jpg",
      "category_id": 2
    }
  ],
  "total_elements": 150,
  "total_pages": 15,
  "current_page": 0,
  "is_last": false
}
```
### 1.2. Найти товары по имени
**Метод:** `GET`  
**Путь:** `/products/search`  
**Доступ:** Всем  

**Параметры (Query):**
#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=price_retail,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |
| **query** | `string` | Строка поиска. | `?query='датчик'` |

**Пример запроса**
`GET /products/search?query=худи`
**Успешный ответ (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "title": "Худи 'Over-size' Базовое",
      "price_retail": 4500.00,
      "price_wholesale": 3800.00,
      "main_image_url": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_black.jpg",
      "category_id": 5
    }
  ],
  "total_elements": 1,
  "total_pages": 1,
  "current_page": 0,
  "is_last": true
}
```
### 1.3 Информация о товаре
Получение детальной информации о модели товара, списке доступных модификаций и остатках.

**Метод:** `GET`  
**Путь:** `/products/{id}`  
**Доступ:** Все пользователи  

**Параметры запроса (Query Parameters):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **variant_id** | `int` | ID конкретной модификации. Если не указан, возвращается информация о первом доступном варианте. | `?variant_id=4` |

**Успешный ответ (200 OK):**
```json
{
    "id": 42,
    "title": "Худи 'Over-size' Базовое",
    "description": "Плотный хлопок, свободный крой. Идеально для учебы в университете и долгих сессий кодинга.",
    "category_id": 5,
    "price_retail": 4500.00,
    "price_wholesale": 3800.00,
    "wholesale_threshold": 10,
    "selected_variant": {
        "id": 101,
        "sku": "HD-BLK-XL",
        "size": "XL",
        "color": "Черный",
        "weight": 0.85,
        "images": [
            {
                "url": "https://res.cloudinary.com/hekr/image/upload/v1/products/hoodie_blk_front.jpg",
                "type": "MAIN"
            },
            {
                "url": "https://res.cloudinary.com/hekr/image/upload/v1/products/hoodie_blk_back.jpg",
                "type": "GALLERY"
            }
        ],
        "stock": [
            {
                "warehouse_id": 1,
                "address": "г. Москва ул. Складская д. 3",
                "quantity": 15
            },
            {
                "warehouse_id": 2,
                "address": "г. Краснодар ул. Красная 140",
                "quantity": 2
            }
        ]
    },
    "all_variants": [
        {
            "id": 101,
            "size": "XL",
            "color": "Черный",
            "in_stock": true
        },
        {
            "id": 102,
            "size": "L",
            "color": "Черный",
            "in_stock": true
        },
        {
            "id": 103,
            "size": "XL",
            "color": "Серый меланж",
            "in_stock": false
        }
    ]
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
    "error": "Not Found",
    "message": "Товар или указанный вариант не найден"
}
```

**Безуспешный ответ (400 Bad Request):**
```json
{
    "error": "Bad Request",
    "message": "Вариант принадлежит другому товару"
}
```
## 2. Аутентификация (Auth)
Аутентификация и регистрация пользователей
### 2.1 Аутентификация
Вход пользователя по логину и паролю<br/>

**Метод:** `POST`  
**Путь:** `/auth/login`  
**Доступ:** Всем  
**Устанавливает Cookie:** refreshToken  
**Тело запроса (Body):**
```json
{
    "login": "kirill_petrov",
    "password": "orapass"
}
```
**Успешный ответ (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "role": "CLIENT",
  "description": "Успешный вход"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Неверный логин или пароль"
}
```
### 2.2.1 Регистрация физического лица (INDIVIDUAL)
Регистрация нового пользователя с типом "Физическое лицо". Данные сохраняются в таблицы `users` и `individual_details`.

**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  

**Тело запроса (Body):**
```json
{
  "login": "kirill_petrov",
  "password": "securepass123",
  "client_type": "INDIVIDUAL",
  "phone": "+79991234567",
  "email": "petrov.k@example.com",
  "individual_details": {
    "first_name": "Кирилл",
    "last_name": "Петров",
    "midname": "Дмитриевич",
    "birthdate": "2000-01-01",
    "passport_series": "4510",
    "passport_number": "123456"
  }
}
**Успешный ответ (201 Created):**
```json
{
  "login": "kirill_petrov",
  "description": "Успешная регистрация"
}
```
**Безуспешный ответ (409 Conflict):**
```json
{
  "error": "Conflict",
  "message": "Пользователь с таким логином уже существует",
  "field": "login"
}
```
### 2.2.2 Регистрация юридического лица (LEGAL)
Регистрация нового пользователя LEGAL<br/>

**Метод:** `POST`  
**Путь:** `/auth/registration`  
**Доступ:** Всем  
**Тело запроса (Body):**
```json
{
  "login": "xromzas_software_llc",
  "password": "securepass",
  "client_type": "LEGAL",
  "phone": "+74951234567",
  "email": "corp@xromza.tech",
  "legal_details": {
    "company_name": "ООО Программное Обеспечение ИксРомзас",
    "inn": "1337069420",
    "kpp": "177301001",
    "ogrn": "1027710132195",
    "legal_address": "г. Москва, ул. Заводская, 10"
  }
}
```
**Успешный ответ (201 Created):**
```json
{
  "login": "xromzas_software_llc",
  "description": "Успешная регистрация"
}
```
**Безуспешный ответ (409 Conflict):**
```json
{
  "error": "Conflict",
  "message": "Пользователь с таким логином уже существует",
  "field": "login"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Поле 'email' обязательно для заполнения",
  "field": "email"
}
```


### 2.3 Обновление токена (Refresh)
Обновление JWT-токена по Refresh-токену<br/>

**Метод:** `POST`  
**Путь:** `/auth/refresh`  
**Доступ:** Всем  
**Cookie:** Достаёт данные из refreshToken cookie

**Успешный ответ (201 Created):**
```json
{
  "token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "type": "Bearer"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Токен устарел, войдите ещё раз",
}
```
## 3. Профиль (Profile)
Просмотр информации о профиле клиента
### 3.1 Данные клиента
Получение данных об аккаунте<br/>

**Метод:** `GET`  
**Путь:** `/profile`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
**Тело запроса (Body):** *Отсутствует*<br/>
**Успешный ответ (200 OK):**
```json
{
  "id": 1,
  "login": "kirill_petrov",
  "role": "CLIENT",
  "client_type": "INDIVIDUAL",
  "email": "petrov.k@example.com",
  "phone": "+79991234567",
  "created_at": "2026-03-15T12:00:00",
  "is_approved": true,
  
  "first_name": "Кирилл",
  "last_name": "Петров",
  "midname": "Дмитриевич",
  "birthdate": "2000-01-01",
  "passport_series": "4510",
  "passport_number": "123456",

  "company_name": null,
  "inn": null,
  "kpp": null,
  "ogrn": null,
  "legal_address": null
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к профилю необходимо авторизоваться"
}
```
## 4. История заказов (Order History)
Просмотр информации о истории заказов клиента
### 4.1 Список заказов
Получение списка о заказах<br/>

**Метод:** `GET`  
**Путь:** `/order_history`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>
#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=date,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |

**Успешный ответ (200 OK):**
```json
[
  {
    "id": 1024,
    "date": "2026-03-20T15:30:00",
    "total_price": 2450.00,
    "status": "DELIVERED",
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "warehouse_id": 1,
    "items_count": 3
  },
  {
    "id": 1056,
    "date": "2026-04-01T10:15:00",
    "total_price": 120.50,
    "status": "IN_PROGRESS",
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "warehouse_id": 2,
    "items_count": 1
  }
]
```
### 4.2 Информация о заказе
Получение информации о конкретном заказе<br/>

**Метод:** `GET`  
**Путь:** `/order_history/{id}`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
{
    "id": 1024,
    "date": "2026-03-20T15:30:00",
    "status": "DELIVERED",
    "total_price": 41800.00,
    "price_type": "WHOLESALE", 
    "payment_method": "INVOICE",
    "delivery_method": "COURIER",
    "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
    "status_history": [
        {
            "status": "NEW",
            "changed_at": "2026-03-20T15:30:00",
            "changed_by_name": "System",
            "comment": "Заказ был создан"
        },
        {
            "status": "ASSEMBLING",
            "changed_at": "2026-03-21T10:45:00",
            "changed_by_name": "Мадин (Менеджер)",
            "comment": "Заказ собран и готовится к отправке"
        },
        {
            "status": "SHIPPING",
            "changed_at": "2026-03-23T14:20:00",
            "changed_by_name": "Мадин (Менеджер)",
            "comment": "Товар в пути"
        },
        {
            "status": "DELIVERED",
            "changed_at": "2026-03-23T14:20:00",
            "changed_by_name": "Система (Автоматически)",
            "comment": "Товар успешно доставлен"
        }
    ],
    "items": [
        {
            "product_id": 42,
            "variant_id": 101,
            "title": "Худи 'Over-size' Базовое",
            "main_image_url": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_thumb.jpg",
            "sku": "HD-BLK-XL",
            "size": "XL",
            "color": "Черный",
            "quantity": 10,
            "price_at_purchase": 3800.00,
            "total_item_price": 38000.00
        },
        {
            "product_id": 15,
            "variant_id": 205,
            "title": "Футболка 'Minimalism' Белая",
            "main_image_url": "https://res.cloudinary.com/xromza/image/upload/v1/products/tshirt_white_thumb.jpg",
            "sku": "TSH-WHT-M",
            "size": "M",
            "color": "Белый",
            "quantity": 2,
            "price_at_purchase": 1900.00,
            "total_item_price": 3800.00
        }
    ]
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
    "error": "Not Found",
    "message": "Заказ не найден"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к заказам необходимо авторизоваться"
}
```
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "У вас нет доступа к этому заказу"
}
```
## 5. Корзина (Cart)
Просмотр корзины клиента
### 5.1 Список товаров в корзине
Получение списка товаров в корзине<br/>

**Метод:** `GET`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>
**Успешный ответ (200 OK):**
```json
{
    "items": [
        {
            "product_id": 42,
            "variant_id": 101,
            "title": "Худи 'Over-size' Базовое",
            "main_image_url": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_thumb.jpg",
            "sku": "HD-BLK-XL",
            "size": "XL",
            "color": "Черный",
            "quantity": 12,
            "available_stock": 50,
            "applied_price": 3800.00,
            "price_type": "WHOLESALE",
            "subtotal": 45600.00
        },
        {
            "product_id": 15,
            "variant_id": 205,
            "title": "Футболка хлопок 100%",
            "main_image_url": "https://res.cloudinary.com/xromza/image/upload/v1/products/tshirt_white_thumb.jpg",
            "sku": "TSH-WHT-M",
            "size": "M",
            "color": "Белый",
            "quantity": 2,
            "available_stock": 1, 
            "applied_price": 1500.00,
            "price_type": "RETAIL",
            "subtotal": 3000.00
        }
    ],
    "total_price": 48600.00,
    "discount_applied": 0.00,
    "can_checkout": true
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к корзине необходимо авторизоваться"
}
```
### 5.2 Удаление товара из корзины
Удаление товара из корзины<br/>

**Метод:** `DELETE`  
**Путь:** `/cart/{variant_id}`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
[
  {
    "variant_id": 101,
    "title": "Худи 'Over-size' Базовое (XL, Черный)",
    "message": "Позиция успешно удалена из корзины"
  }
]
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к корзине необходимо авторизоваться"
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Данный товар не найден в вашей корзине"
}
```
### 5.3 Очистка корзины
Удаление всех товаров из корзины<br/>

**Метод:** `DELETE`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>

**Тело запроса (Body):** *Отсутствует*<br/>

**Успешный ответ (200 OK):**
```json
{
    "count": 2,
    "message": "Товары успешно удалены из корзины"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для доступа к корзине необходимо авторизоваться"
}
```
### 5.4 Добавление или изменение количества
Добавление товара в корзину или обновление его количества.

**Метод:** `POST`  
**Путь:** `/cart`  
**Доступ:** Авторизованный пользователь  

**Тело запроса (Body):**
```json
{
  "variant_id": 101,
  "quantity": 5
}
```
**Успешный ответ (200 OK):**
```json
{
  "variant_id": 101,
  "current_quantity": 5,
  "message": "Корзина обновлена"
}
```
## 6. Оформление заказа (Checkout)
Интерфейс оформления заказа
### 6.1 Создание заказа всей корзины
Офомление заказа со всеми товарами из корзины

**Метод:** `POST`  
**Путь:** `/orders`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "warehouse_id": 1,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "payment_method": "CARD"
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1025,
  "status": "NEW",
  "total_price": 41800.00,
  "payment_method": "CARD",
  "message": "Заказ успешно оформлен, корзина очищена"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для оформления заказа необходимо авторизоваться"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Недостаточно товара на складе: Худи 'Over-size' (XL, Черный). Доступно: 2 шт."
}
```
### 6.2 Создание заказа одного товара
Офомление заказа со всеми товарами из корзины

**Метод:** `POST`  
**Путь:** `/orders/single`  
**Доступ:** Авторизованный пользователь (по токену)<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "warehouse_id": 1,
  "address": "г. Москва, ул. Арбат, д. 1, кв. 12",
  "variant_id": 101,
  "quantity": 5
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1026,
  "status": "NEW",
  "total_price": 19000.00,
  "message": "Заказ успешно оформлен"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для оформления заказа необходимо авторизоваться"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Недостаточно товара на складе: Худи 'Over-size' (XL, Черный). Доступно: 2 шт."
}
```

## 7. Панель управления (Admin/Manager)
Эндпоинты для сотрудников для управления контентом и логистикой.
### 7.1 Обновление статуса заказа
Изменение статуса заказа и добавление комментария к истории

**Метод:** `PATCH`  
**Путь:** `/admin/orders/{id}/status`  
**Доступ:** `MANAGER`, `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Обязательные поля в body:** `comment`, `new_status`
**Тело запроса (Body):**
```json
{
  "new_status": "ASSEMBLING",
  "comment": "Начата сборка на складе №1"
}
```
**Успешный ответ (200 OK):**
```json
{
  "id": 1025,
  "status": "ASSEMBLING",
  "updated_at": "2026-03-21T18:45:00",
  "changed_by": "madin_manager"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.2 Обновление остатков на складе
Установка текущего количества товара на конкретном складе

**Метод:** `PUT`  
**Путь:** `/admin/stock`  
**Доступ:** `MANAGER`, `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "variant_id": 1,
  "warehouse_id": 1,
  "quantity": 50 
}
```
**Успешный ответ (200 OK):**
```json
{
    "message": "Остатки успешно обновлены"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.3 Создание товаров
Добавление позиции в таблицу `products`.

**Метод:** `POST`  
**Путь:** `/admin/products`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": []
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Ошибка валидации: поле 'title' не может быть пустым"
}
```

**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав доступа (требуется роль ADMIN)"
}
```
### 7.4 Создание вариантов товара
Добавление позиции в таблицу `product_variants`.

**Метод:** `POST`  
**Путь:** `/admin/products/{product_id}/variants`  
**Доступ:** `ADMIN`, `MANAGER`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "size": "XL",
  "color": "Чёрный",
  "weigth": 0.85,
  "sku": "HD-BLK-XL"
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": [
    {
      "id": 101,
      "sku": "HD-BLK-XL",
      "size": "XL",
      "color": "Черный",
      "weight": 0.85
    }
  ]
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Ошибка валидации: поле 'sku' не может быть пустым"
}
```

**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав доступа (требуется роль ADMIN или MANAGER)"
}
```
### 7.5 Список всех пользователей
Метод предназначен для административного управления доступом. Позволяет просматривать базу пользователей с применением гибкой фильтрации по статусу верификации и сортировки.

**Метод:** `GET`  
**Путь:** `/admin/users`  
**Доступ:** `ADMIN`  
**Заголовки (Headers):** `Authorization: Bearer <your_token_here>`

---

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **approved** | `boolean` | Фильтр по статусу `is_approved`. `false` — только те, кто ждет подтверждения. | `?approved=false` |
| **sort** | `string` | Поле и направление сортировки (`asc` — возр., `desc` — убыв.). | `?sort=login,asc` |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |

---

#### Тело запроса (Body)
*Отсутствует*

---

#### Успешный ответ (200 OK)
Возвращает массив объектов пользователей, соответствующих заданным фильтрам.

```json
[
[
  {
    "id": 1,
    "login": "pavalapi",
    "role": "CLIENT",
    "created_at": "2026-03-21T18:45:00",
    "is_approved": false,
    "client_type": "LEGAL",
    "phone": "+78612003040",
    "email": "info@technolab.ru",
    "company_name": "ООО Технолаб",
    "inn": "2310998877",
    "kpp": "231001001",
    "ogrn": "1022301611111",
    "legal_address": "г. Краснодар, ул. Красная, д. 1",
    "first_name": null,
    "last_name": null,
    "midname": null,
    "birthdate": null,
    "passport_series": null,
    "passport_number": null
  },
  {
    "id": 4,
    "login": "kklaha",
    "role": "CLIENT",
    "created_at": "2026-03-21T18:45:00",
    "is_approved": true,
    "client_type": "INDIVIDUAL",
    "phone": "+79181234567",
    "email": "k.lazarev@example.com",
    "company_name": null,
    "inn": null,
    "kpp": null,
    "ogrn": null,
    "legal_address": null,
    "first_name": "Константин",
    "last_name": "Лазарев",
    "midname": "Дмитриевич",
    "birthdate": "1995-05-15",
    "passport_series": "0315",
    "passport_number": "123456"
  }
]
]
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "У вас недостаточно прав для выполнения этой операции"
}
```
**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Указано несуществующее поле для сортировки"
}
```


### 7.6 Изменение данных пользователя
Изменение данных пользователя в таблице `users`

**Метод:** `PATCH`  
**Путь:** `/admin/users/{id}`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (id=1) (Body):**
```json
{
  "is_approved": true
}
```
**Успешный ответ (200 OK):**
```json
{
    "id": 1,
    "login": "pavalapi",
    "created_at": "2026-03-21T18:45:00",
    "role": "CLIENT",
    "client_type": "LEGAL",
    "is_approved": true 
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Тело запроса (Body):**
```json
{
  "role": "ADMIN",
  "is_approved": true
}
```
**Успешный ответ (id=4)(200 OK):**
```json
{

    "id": 4,
    "login": "kklaha",
    "created_at": "2026-03-21T18:45:00",
    "role": "ADMIN",
    "client_type": null,
    "is_approved": true
}
```
**Безуспешный ответ (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Пользователь с таким ID не найден"
}
```
### 7.7 Создание склада
Добавление склада в таблицу `warehouses`.

**Метод:** `POST`  
**Путь:** `/admin/warehouses`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "address": "г. Краснодар ул. Красная 140 п.3"
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 1337,
  "address": "г. Краснодар ул. Красная 140 п.3"
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
### 7.8 Список всех складов
Позволяет просматривать базу складов

**Метод:** `GET`  
**Путь:** `/admin/warehouses`  
**Доступ:** `ADMIN`, `MANAGER`
**Заголовки (Headers):** `Authorization: Bearer <your_token_here>`

---

#### Параметры запроса (Query Parameters)
Используются для фильтрации и управления отображением списка. Все параметры являются опциональными.

| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **page** | `int` | Номер страницы для пагинации (начиная с 0). | `?page=0` |
| **size** | `int` | Количество записей на одной странице. | `?size=10` |
| **address** | `string` | Поиск по строке | `?address=Москва` |

---

#### Тело запроса (Body)
*Отсутствует*

---

#### Успешный ответ (200 OK)
Возвращает массив объектов складов

```json
[
    {
        "id": 1,
        "address": "г. Москва ул. Складская д. 3"
    },
    {
        "id": 2,
        "address": "г. Великие Луки ул. Потайная д. 341/1"
    }
]
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "У вас недостаточно прав для выполнения этой операции"
}
```
### 7.9 Изменение общей информации о товаре
Позволяет изменить информацию о товаре

**Метод:** `PATCH`  
**Путь:** `/admin/products/{id}`  
**Доступ:** `ADMIN`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "title": "Худи 'Over-size' Премиальное",
  "price_retail": 4600.00,
}
```
**Успешный ответ (202 Accepted):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Премиальное",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4600.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": [],
  "is_active": true
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Безуспешный ответ (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Такого товара существует"
}
```

**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав доступа (требуется роль ADMIN)"
}
```

**Тело запроса (Body):**
```json
{
  "is_active": false
}
```
**Успешный ответ (202 Accepted):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Премиальное",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4600.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": [],
  "is_active": false
}
```

### 7.10 Изменение информации о варианте товара
Позволяет изменить информацию о варианте товара

**Метод:** `PATCH`  
**Путь:** `/admin/products/{product_id}/variants/{variant_id}`  
**Доступ:** `ADMIN`, `MANAGER`<br/>
**Заголовки (Headers):**
`Authorization: Bearer <your_token_here>`<br/>
 
**Тело запроса (Body):**
```json
{
  "weigth": 1.25,
  "sku": "HD-BLK-XL-125"
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": [
    {
      "id": 101,
      "sku": "HD-BLK-XL-125",
      "size": "XL",
      "color": "Черный",
      "weight": 1.25
    }
  ],
  "is_active": true
}
```
**Безуспешный ответ (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Для работы с панелью необходимо авторизоваться"
}
```

**Безуспешный ответ (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Ошибка валидации: поле 'sku' не может быть пустым"
}
```

**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав доступа (требуется роль ADMIN или MANAGER)"
}
```

**Тело запроса (Body):**
```json
{
  "is_active": false
}
```
**Успешный ответ (201 Created):**
```json
{
  "id": 23,
  "title": "Худи 'Over-size' Базовое",
  "description": "Плотный хлопок 100%, свободный крой. Унисекс.",
  "price_retail": 4500.00,
  "price_wholesale": 3800.00,
  "wholesale_threshold": 10,
  "category_id": 5,
  "variants": [
    {
      "id": 101,
      "sku": "HD-BLK-XL-125",
      "size": "XL",
      "color": "Черный",
      "weight": 1.25
    }
  ],
  "is_active": false
}
```

### 7.11 Получить полный список товаров
Метод возвращает все товары системы для управления каталогом. Включает деактивированные товары и суммарный остаток.

**Метод:** `GET`  
**Путь:** `/admin/products`  
**Доступ:** `ADMIN`, `MANAGER`  

**Параметры запроса (Query Parameters):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **page** | `int` | Номер страницы (начиная с 0). | `0` |
| **size** | `int` | Количество элементов на странице. | `20` |
| **show_inactive** | `boolean` | Включить в выдачу товары с `is_active = false`. | `true` |

**Успешный ответ (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "title": "Худи 'Over-size' Базовое",
      "price_retail": 4500.00,
      "price_wholesale": 3800.00,
      "is_active": true,
      "category_id": 5,
      "total_stock": 145
    },
    {
      "id": 15,
      "title": "Футболка 'Old Collection'",
      "price_retail": 1200.00,
      "price_wholesale": 900.00,
      "is_active": false,
      "category_id": 2,
      "total_stock": 0
    }
  ],
  "total_elements": 256,
  "total_pages": 13,
  "size": 20,
  "number": 0
}
```
### 7.12 Поиск товаров по фильтрам
Расширенный поиск для административной панели. Позволяет комбинировать фильтры по названию, артикулу (SKU) и категории.

**Метод:** `GET`  
**Путь:** `/api/admin/products/search`  
**Доступ:** `ADMIN`, `MANAGER`  

**Параметры запроса (Query Parameters):**
| Параметр | Тип | Описание | Пример |
| :--- | :--- | :--- | :--- |
| **query** | `string` | Поиск по названию товара (частичное совпадение). | `худи` |
| **sku** | `string` | Поиск по точному артикулу (SKU) варианта. | `HD-BLK-XL` |
| **category_id** | `int` | Фильтр по идентификатору категории. | `5` |
| **is_active** | `boolean` | Фильтр по статусу (true — только активные, false — только удаленные). | `true` |
| **page** | `int` | Номер страницы (с 0). | `0` |
| **size** | `int` | Количество элементов на странице. | `10` |

**Успешный ответ (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "title": "Худи 'Over-size' Базовое",
      "is_active": true,
      "category_id": 5,
      "variants": [
        {
          "id": 101,
          "sku": "HD-BLK-XL",
          "size": "XL",
          "color": "Черный",
          "price_retail": 4500.00,
          "price_wholesale": 3800.00,
          "stock": 15
        }
      ]
    }
  ],
  "total_elements": 1,
  "total_pages": 1,
  "current_page": 0,
  "size": 10
}
```
### 7.13 Добавление фотографии к варианту товара
Метод позволяет загрузить файл изображения и привязать его к конкретному варианту товара. Файлы сохраняются в хранилище, а запись о них — в таблицу `images`.

**Метод:** `POST`  
**Путь:** `/api/admin/products/{product_id}/variants/{variant_id}/images`  
**Доступ:** `ADMIN`, `MANAGER`  

**Тело запроса (Multipart Form Data):**
| Параметр | Тип | Описание | Обязательно |
| :--- | :--- | :--- | :--- |
| **file** | `File` | Бинарный файл изображения (png, jpg, webp). | Да |
| **type** | `string` | Тип изображения: `MAIN` (обложка) или `GALLERY` (доп. фото). или `THUMBNAIL`| Да |

**Успешный ответ (201 Created):**
```json
{
  "id": 501,
  "variant_id": 101,
  "url": "[https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_new.jpg](https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_new.jpg)",
  "type": "MAIN",
  "created_at": "2026-04-14T22:30:00"
}
```

### 7.14 Удаление фотографии
Метод удаляет запись об изображении из базы данных и инициирует удаление физического файла из хранилища.

**Метод:** `DELETE`  
**Путь:** `/admin/products/{product_id}/variants/{variant_id}/images/{image_id}`  
**Доступ:** `ADMIN`, `MANAGER`  

**Параметры пути (Path Parameters):**
| Параметр | Тип | Описание |
| :--- | :--- | :--- |
| **product_id** | `long` | ID товара. |
| **variant_id** | `long` | ID варианта. |
| **image_id** | `long` | ID конкретной фотографии. |

**Успешный ответ (204 No Content):**
*Тело ответа отсутствует. Это подтверждает успешное удаление.*

**Ошибки:**
* **401 Unauthorized**: Пользователь не авторизован.
* **403 Forbidden**: Недостаточно прав.
* **404 Not Found**: Фотография с таким ID не найдена или она не принадлежит указанному варианту.
### 7.15 Изменение скидки
Метод изменяет скидку на категорию

**Метод:** `PATCH`
**Путь:** `/admin/discounts/{category_id}`
**Доступ:** `ADMIN`, `MANAGER` 

**Тело запроса (Body):**
```json
{
  "discount": 0.1 
}
```

**Успешный ответ (200 ОК):**
```json
{
  "category_id": 2,
  "discount": 0.1
}
```
**Безуспешный ответ (404 Not Found)**
```json
{
  "error": "Not Found",
  "message": "Категория не найдена"
}
```
**Безуспешный ответ (403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Недостаточно прав доступа (требуется роль ADMIN или MANAGER)"
}
```