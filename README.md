# Headless CMS App

最小構成のAPIベースヘッドレスCMS。microCMSのようなコンテンツ管理システムをシンプルに実装しました。

## 概要

このプロジェクトは、Node.js + Express + Prismaを使用した軽量なヘッドレスCMSです。コンテンツモデルの管理、コンテンツのCRUD操作、および公開API経由でのコンテンツ取得を実現します。

## 技術スタック

| 層 | 技術 |
|-----|------|
| **バックエンド** | Node.js + Express.js |
| **データベース** | SQLite + Prisma ORM |
| **認証** | JWT + APIキー |
| **API形式** | RESTful JSON |

## 主な機能

### 管理API (`/api/admin`)
- **コンテンツモデル管理**
  - モデルの作成、取得、更新、削除
  - 動的なフィールド定義
  
- **コンテンツ管理**
  - コンテンツのCRUD操作
  - モデルに基づいたデータ管理

### 公開API (`/api/v1`)
- **コンテンツ取得**
  - モデルIDでフィルタリング
  - 個別コンテンツの取得

### セキュリティ
- JWT認証（管理API用）
- APIキー認証（公開API用）

## インストール

### 前提条件
- Node.js 14+ 
- npm または yarn

### セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/TommyKammy/headless-cms-app
cd headless-cms-app
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env
```

.envファイルの内容：
```
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="your-secret-key"
API_KEY="your-api-key"
```

4. データベースをセットアップ
```bash
npm run db:migrate
```

## 使用方法

### 開発サーバーの起動

```bash
# 開発モード（自動リロード）
npm run dev

# 本番モード
npm start
```

サーバーが起動すると：
- Admin API: `http://localhost:3000/api/admin`
- Public API: `http://localhost:3000/api/v1`
- 管理画面: `http://localhost:3000`

### 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番サーバー起動
npm start

# データベースマイグレーション
npm run db:migrate

# Prisma Studio起動
npm run db:studio

# Prisma クライアント生成
npm run db:generate
```

## API仕様

### 管理API

#### 認証
すべてのリクエストにJWTトークンが必要です：
```
Authorization: Bearer <token>
```

#### コンテンツモデル

**モデル作成**
```
POST /api/admin/models
Content-Type: application/json

{
  "name": "ブログ投稿",
  "apiId": "blog_post",
  "description": "ブログ記事のモデル",
  "fields": [
    {
      "name": "タイトル",
      "fieldId": "title",
      "type": "text",
      "required": true
    },
    {
      "name": "本文",
      "fieldId": "content",
      "type": "richtext",
      "required": true
    }
  ]
}
```

**モデル一覧取得**
```
GET /api/admin/models
```

**モデル詳細取得**
```
GET /api/admin/models/:id
```

**モデル更新**
```
PUT /api/admin/models/:id
```

**モデル削除**
```
DELETE /api/admin/models/:id
```

#### コンテンツ

**コンテンツ作成**
```
POST /api/admin/contents
Content-Type: application/json

{
  "contentModelId": "model-uuid",
  "data": {
    "title": "記事タイトル",
    "content": "<p>記事の本文</p>"
  }
}
```

**コンテンツ一覧取得**
```
GET /api/admin/contents
```

**コンテンツ詳細取得**
```
GET /api/admin/contents/:id
```

**コンテンツ更新**
```
PUT /api/admin/contents/:id
```

**コンテンツ削除**
```
DELETE /api/admin/contents/:id
```

### 公開API

#### 認証
APIキーをヘッダーで指定します：
```
X-API-Key: your-api-key
```

#### コンテンツ取得

**モデルのコンテンツ一覧**
```
GET /api/v1/:modelId
```

**個別コンテンツ取得**
```
GET /api/v1/:modelId/:contentId
```

## プロジェクト構造

```
├── prisma/
│   ├── schema.prisma          # データベーススキーマ定義
│   └── migrations/            # マイグレーション履歴
├── public/
│   ├── index.html             # 管理画面
│   └── js/
│       └── api.js             # フロントエンドAPI連携
├── src/
│   ├── server.js              # メインサーバーファイル
│   ├── routes/
│   │   ├── admin.js           # 管理APIルート
│   │   └── public.js          # 公開APIルート
│   ├── controllers/
│   │   ├── adminController.js # 管理API処理
│   │   └── publicController.js# 公開API処理
│   ├── repositories/
│   │   ├── contentModelRepository.js # モデルのDB操作
│   │   └── contentRepository.js      # コンテンツのDB操作
│   └── middleware/
│       └── auth.js            # 認証ミドルウェア
├── package.json
├── .env                       # 環境変数（git無視）
└── README.md
```

## データベーススキーマ

### ContentModel
```javascript
{
  id: String (UUID)
  name: String              // モデル名
  apiId: String (UNIQUE)    // API識別子
  description: String?
  fields: Field[]           // フィールド定義
  contents: Content[]       // コンテンツ
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Field
```javascript
{
  id: String (UUID)
  name: String              // フィールド名
  fieldId: String           // API識別子
  type: String              // テキスト、リッチテキストなど
  required: Boolean
  contentModelId: String    // 所属モデル
}
```

### Content
```javascript
{
  id: String (UUID)
  contentModelId: String    // 所属モデル
  data: String (JSON)       // コンテンツデータ
  createdAt: DateTime
  updatedAt: DateTime
}
```

## セキュリティ

- **管理API**: JWT トークン認証
- **公開API**: APIキー認証
- **CORS**: 設定可能
- **入力検証**: Prismaスキーマで強制

## 今後の拡張可能な機能

- [ ] ファイル/画像アップロード機能
- [ ] リッチテキストエディタ
- [ ] バージョン管理・公開予約
- [ ] 多言語対応
- [ ] キャッシング
- [ ] ユーザー管理
- [ ] ロールベースアクセス制御（RBAC）

## ライセンス

MIT

## 開発者

Tommy Kawada
