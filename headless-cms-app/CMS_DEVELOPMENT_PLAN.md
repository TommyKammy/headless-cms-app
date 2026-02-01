# 最小構成ヘッドレスCMS開発プラン

## 1. 概要

microCMSのようなAPIベースのヘッドレスCMSを最小構成で開発するためのプランです。

## 2. 技術スタック

| 層 | 技術 | 理由 |
|-----|------|------|
| **バックエンド** | Node.js + Express | シンプルで学習コストが低い |
| **データベース** | SQLite | ファイルベースで設定が簡単 |
| **ORM** | Prisma | 型安全でマイグレーション管理が容易 |
| **認証** | JWT | ステートレスでシンプル |
| **API形式** | RESTful JSON | 実装が簡単で汎用性が高い |

## 3. 最小機能セット（MVP）

### Phase 1: 基本機能
- [ ] コンテンツモデル（スキーマ）管理
- [ ] コンテンツのCRUD操作
- [ ] REST APIによるコンテンツ取得
- [ ] 管理画面（シンプルなWeb UI）
- [ ] APIキー認証

### Phase 2: 拡張機能（将来）
- [ ] 画像/ファイルアップロード
- [ ] リッチテキストエディタ
- [ ] バージョン管理
- [ ] 多言語対応

## 4. データベース設計

```prisma
// schema.prisma
model ContentModel {
  id          String   @id @default(uuid())
  name        String
  apiId       String   @unique
  description String?
  fields      Field[]
  contents    Content[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Field {
  id            String       @id @default(uuid())
  name          String
  fieldId       String
  type          FieldType
  required      Boolean      @default(false)
  contentModel  ContentModel @relation(fields: [contentModelId], references: [id])
  contentModelId String
}

model Content {
  id            String       @id @default(uuid())
  contentModel  ContentModel @relation(fields: [contentModelId], references: [id])
  contentModelId String
  data          Json
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

enum FieldType {
  TEXT
  NUMBER
  BOOLEAN
  DATE
  RICHTEXT
}
```

## 5. APIエンドポイント設計

### 管理用API（認証必須）
```
POST   /api/admin/models          # コンテンツモデル作成
GET    /api/admin/models          # コンテンツモデル一覧
GET    /api/admin/models/:id      # コンテンツモデル詳細
PUT    /api/admin/models/:id      # コンテンツモデル更新
DELETE /api/admin/models/:id      # コンテンツモデル削除

POST   /api/admin/contents        # コンテンツ作成
GET    /api/admin/contents        # コンテンツ一覧
GET    /api/admin/contents/:id    # コンテンツ詳細
PUT    /api/admin/contents/:id    # コンテンツ更新
DELETE /api/admin/contents/:id    # コンテンツ削除
```

### 公開API（APIキー認証）
```
GET    /api/v1/:modelId           # コンテンツ一覧取得
GET    /api/v1/:modelId/:contentId # コンテンツ詳細取得
```

## 6. プロジェクト構成

```
headless-cms/
├── src/
│   ├── config/           # 設定ファイル
│   ├── routes/           # APIルート
│   │   ├── admin.js      # 管理API
│   │   └── public.js     # 公開API
│   ├── controllers/      # コントローラー
│   ├── middleware/       # ミドルウェア
│   │   ├── auth.js       # 認証
│   │   └── validation.js # バリデーション
│   ├── services/         # ビジネスロジック
│   └── prisma/           # Prisma設定
├── prisma/
│   └── schema.prisma     # DBスキーマ
├── public/               # 管理画面UI
├── package.json
└── README.md
```

## 7. 開発ステップ

### Step 1: 環境構築（1日）
- [ ] Node.jsプロジェクト初期化
- [ ] Expressサーバー構築
- [ ] Prisma設定
- [ ] SQLiteデータベース接続

### Step 2: データ層実装（1-2日）
- [ ] Prismaスキーマ定義
- [ ] データベースマイグレーション
- [ ] リポジトリパターン実装

### Step 3: API実装（2-3日）
- [ ] 管理API（モデルCRUD）
- [ ] 管理API（コンテンツCRUD）
- [ ] 公開API
- [ ] 認証ミドルウェア

### Step 4: 管理画面UI（2-3日）
- [ ] シンプルなHTML/CSS/JS管理画面
- [ ] モデル定義フォーム
- [ ] コンテンツ編集フォーム
- [ ] APIキー管理画面

### Step 5: テスト・ドキュメント（1日）
- [ ] APIテスト
- [ ] README作成
- [ ] セットアップ手順書

## 8. 見積もり

- **総工数**: 7-10日（フルタイムで作業する場合）
- **最小チーム**: 1人（フルスタック開発者）

## 9. 次のステップ

1. `npm init` でプロジェクト初期化
2. Express + Prisma + SQLite のセットアップ
3. コンテンツモデルAPIから実装開始
