# SKILL: コミット作成

## 概要

Conventional Commitsの規約に従い、GitHub MCPサーバー経由でコミットを作成するスキル。

---

## コミットメッセージのフォーマット

```
<type>(<scope>): <タイトル>

<本文（任意）>

<フッター（任意）>
```

---

## type一覧

| type | 用途 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの意味に影響しない変更（フォーマット・空白等） |
| `refactor` | バグ修正・機能追加を伴わないコードの変更 |
| `test` | テストの追加・修正 |
| `chore` | ビルドプロセス・補助ツールの変更 |
| `perf` | パフォーマンス改善 |
| `ci` | CI設定の変更 |
| `build` | ビルドシステム・外部依存の変更 |

---

## scope一覧（FSDレイヤーに対応）

| scope | 対象 |
|---|---|
| `app` | appレイヤー |
| `pages` | pagesレイヤー |
| `widgets` | widgetsレイヤー |
| `features` | featuresレイヤー |
| `entities` | entitiesレイヤー |
| `shared` | sharedレイヤー |

---

## ルール

- タイトルは日本語で記述する
- タイトルは50文字以内に収める
- タイトルの末尾にピリオドをつけない
- 本文は日本語で記述する
- 本文には「何を」「なぜ」変更したかを記述する（「どのように」は不要）
- Breaking Changeがある場合はフッターに `BREAKING CHANGE: <説明>` を記述する

---

## 手順

1. 変更内容を確認し、適切な `type` と `scope` を選定する
2. 以下のフォーマットでコミットメッセージを組み立てる
3. GitHub MCPサーバーの `create_or_update_file` または `push_files` ツールを使用してコミットを作成する

---

## 例

```
feat(entities): 天気APIフェッチ関数を実装

Open-Meteoの/v1/forecastエンドポイントに対して
hourly/dailyパラメータを切り替えてフェッチする関数を追加した。
単位変換はフロント側で行うためAPIパラメータには含めない。
```

```
fix(widgets): 期間切替時にチャートが再描画されない問題を修正

queryKeyにperiodが含まれておらずキャッシュが更新されなかったため、
クエリキーの構成にperiodを追加した。
```

```
chore(app): ESLintにeslint-plugin-boundariesを追加

FSDのレイヤー間依存ルールをLintで強制するために導入した。
```