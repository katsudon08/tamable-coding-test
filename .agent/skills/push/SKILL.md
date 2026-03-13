# SKILL: ブランチ作成・プッシュ

## 概要

Conventional Commitsのtypeに対応したブランチ名を命名し、GitHub MCPサーバー経由でブランチ作成・プッシュを行うスキル。

---

## ブランチ名のフォーマット

```
<type>/<scope>/<説明>
```

- `<type>` : Conventional Commitsのtypeに準ずる
- `<scope>` : FSDレイヤー名に準ずる
- `<説明>` : 変更内容を表すkebab-caseの英語の短いフレーズ

---

## type・scope一覧

commit.skill.md の type一覧・scope一覧に準ずる。

---

## ルール

- ブランチ名はすべて小文字・kebab-caseで記述する
- 説明部分は英語で記述する
- 説明部分は簡潔に（3〜5単語程度）
- ブランチ名にissue番号を記載する場合は`<type>/<issue-number>-<説明>`の形式で記述する
- ベースブランチは原則 `main` とする
- 1つのIssueに対して1つのブランチを作成する

---

## 手順

1. 対応するIssueの `type` と `scope` を確認する
2. 上記フォーマットでブランチ名を組み立てる
3. GitHub MCPサーバーの `create_branch` ツールを使用してブランチを作成する
4. 変更をコミット後、GitHub MCPサーバーの `push_files` ツールを使用してプッシュする

---

## 例

| Issue内容 | ブランチ名 |
|---|---|
| 天気APIフェッチ関数の実装 | `feat/entities/weather-api-fetch` |
| チャート再描画バグの修正 | `fix/widgets/chart-rerender-on-period-change` |
| ESLint設定の追加 | `chore/app/add-eslint-boundaries` |
| フェッチ関数のユニットテスト追加 | `test/entities/weather-api-unit-test` |
| READMEの更新 | `docs/app/update-readme` |