# ph1l74 — Галерея Филата Астахова

Self-hosted веб-галерея для уличного и документального фотографа. Тёмный интерфейс, минималистичный дизайн, акцент на фотографии — без лишних элементов.

**Живая версия:** [photo.ph1l74.com](https://photo.ph1l74.com)

---

## Возможности

- Публичная галерея с разделами: Latest, Special, Albums, Tags
- Просмотр фотографий с EXIF-данными, геолокацией и контекстной навигацией
- Lightbox с zoom по клику и клавиатурной навигацией
- Панель администратора с drag-and-drop загрузкой, управлением альбомами и тегами
- Тёмная и светлая темы (переключатель в шапке)
- OG-изображения для превью в социальных сетях и мессенджерах
- SEO-метаданные на всех страницах
- Google Analytics и Яндекс Метрика (опционально, через `.env`)

---

## Стек

| Слой | Технология |
|------|------------|
| Фронтенд | Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion |
| Стейт | Redux Toolkit |
| База данных | PostgreSQL + Prisma ORM |
| Хранилище | S3-совместимое хранилище (AWS S3 или аналог) |
| Авторизация | NextAuth.js — GitHub OAuth |
| Деплой | Docker + Traefik |

---

## Структура проекта

```
src/
  app/        — Next.js App Router: страницы, лэйауты, API-роуты
  features/   — фичи: upload, photo-viewer, фильтры, admin
  entities/   — сущности: photo, album, tag
  shared/     — UI-компоненты, хуки, утилиты
design/       — HTML-макеты страниц (статические прототипы)
prisma/       — схема базы данных и миграции
```

---

## Дизайн

Стиль: **тёмный fine art брутализм** — интерфейс исчезает, фотография остаётся.

- Нулевые скругления везде
- Три цвета: почти-чёрный, почти-белый, акцентный красный
- Monospace-шрифт для всех метаданных и навигации
- Плоская иерархия глубины (без теней)

Полная документация дизайн-системы: [DESIGN.md](./DESIGN.md)

---

## Локальная разработка

### Требования

- Node.js 20+
- PostgreSQL (локально или через Docker)
- S3-совместимое хранилище с публичным доступом на чтение

### Установка

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd ph1l74-gallery

# 2. Установить зависимости
npm install

# 3. Создать .env на основе примера
cp .env.example .env
# Заполнить переменные в .env

# 4. Применить схему базы данных
npx prisma db push

# 5. Запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

Панель администратора: [http://localhost:3000/admin](http://localhost:3000/admin) — требует авторизации через GitHub.

---

## Деплой через Docker

Проект разворачивается через `docker-compose` в связке с Traefik (обратный прокси, TLS).

### Предварительные требования

- Сервер с Docker и Docker Compose
- Запущенный Traefik с сетью `ph1l74-network` и Let's Encrypt certresolver
- Заполненный `.env`-файл

### Запуск

```bash
# Создать внешнюю сеть (один раз)
docker network create ph1l74-network

# Собрать образ и запустить
docker compose up -d --build
```

При старте автоматически выполняется контейнер-мигратор (`ph1l74-photo-migrate`), который применяет изменения схемы к базе данных. Приложение запускается только после успешного завершения миграции.

### Обновление

```bash
git pull
docker compose up -d --build
```

### Проверка состояния

```bash
# Статус контейнеров
docker compose ps

# Логи приложения
docker compose logs -f ph1l74-photo-app
```

Healthcheck доступен по адресу `/api/healthz` — возвращает `{ "status": "ok" }`.

---

## Переменные среды

Все переменные хранятся в `.env` в корне проекта. Пример с комментариями — [.env.example](./.env.example).

### Ключевые переменные

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `S3_ENDPOINT` | Хост S3-хранилища (без протокола) |
| `S3_BUCKET` | Название бакета |
| `S3_ACCESS_KEY_ID` | Ключ доступа S3 |
| `S3_SECRET_ACCESS_KEY` | Секретный ключ S3 |
| `NEXTAUTH_SECRET` | Случайная строка для подписи JWT |
| `NEXTAUTH_URL` | Публичный URL приложения |
| `GITHUB_CLIENT_ID` | ID GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | Секрет GitHub OAuth App |
| `ADMIN_ALLOWLIST` | Email(ы) администраторов через запятую |
| `NEXT_PUBLIC_SITE_URL` | Публичный URL (для OG-метаданных) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID (опционально) |
| `NEXT_PUBLIC_YM_ID` | Яндекс Метрика ID (опционально) |

### GitHub OAuth App

1. Перейти в [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
2. Homepage URL: `https://your-domain.com`
3. Callback URL: `https://your-domain.com/api/auth/callback/github`
4. Скопировать Client ID и Client Secret в `.env`

---

## API

| Метод | Роут | Описание |
|-------|------|----------|
| GET | `/api/photos` | Список фото (фильтры: `albumId`, `tagId`) |
| GET | `/api/photos/[id]` | Одна фотография |
| GET | `/api/albums` | Список альбомов |
| GET | `/api/albums/[id]` | Один альбом с фото |
| GET | `/api/tags` | Список тегов |
| POST | `/api/upload` | Presigned URL для загрузки в S3 |
| POST | `/api/upload/exif` | Парсинг EXIF из файла |
| GET | `/api/og` | Генерация OG-изображения (`?type=photo&id=...`) |
| GET | `/api/healthz` | Healthcheck |
