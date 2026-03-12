# SKILL: PR作成

## 概要

Conventional Commitsのtypeに対応したPRタイトル・本文を組み立て、GitHub MCPサーバー経由でPRを作成するスキル。

---

## PRタイトルのフォーマット

```
<type>(<scope>): <タイトル>
```

対応するIssueのタイトルと同一のフォーマットを使用する。

---

## type・scope一覧

commit.skill.md の type一覧・scope一覧に準ずる。

---

## 本文のフォーマット

```markdown
## 概要

<このPRで対応した内容を日本語で簡潔に記述>

## 対応内容

- [ ] <対応タスク1>
- [ ] <対応タスク2>

## 変更の背景・目的

<なぜこの変更が必要だったかを日本語で記述>

## 動作確認

- [ ] <確認項目1>
- [ ] <確認項目2>

## 関連Issue

close #<Issue番号>

## 備考

<レビュワーへの補足・注意点があれば記述（任意）>
```

---

## ルール

- タイトルは日本語で記述する
- タイトルは50文字以内に収める
- 本文は日本語で記述する
- マージ先ブランチは原則 `main` とする
- 対応するIssueを `close #<番号>` で必ず紐付ける
- 対応するラベルをcreate-issue.skill.mdのラベル対応表に従い付与する

---

## 手順

1. 対応するIssueの `type`・`scope`・番号を確認する
2. タイトルと本文を上記フォーマットで組み立てる
3. GitHub MCPサーバーの `create_pull_request` ツールを使用してPRを作成する

---

## 例

```
feat(entities): 天気APIフェッチ関数を実装
```

```markdown
## 概要

Open-Meteoの/v1/forecastエンドポイントに対してhourly/dailyを切り替えてフェッチする関数を実装した。

## 対応内容

- [x] fetchHourlyWeather関数の実装
- [x] fetchDailyWeather関数の実装
- [x] HourlyResponse・DailyResponse型の定義
- [x] ユニットテストの作成

## 変更の背景・目的

都市・指標・期間の選択に応じて適切なAPIパラメータを組み立て、型安全にレスポンスを取得する必要があった。

## 動作確認

- [x] 東京・48時間のhourlyデータが正しく取得できること
- [x] 東京・7日間のdailyデータが正しく取得できること
- [x] ユニットテストがすべてパスすること

## 関連Issue

close #1

## 備考

単位変換はAPIパラメータでは行わず、unit-converter.tsで処理する設計のため、
このPRにはunit-converter.tsの変更は含まない。
```