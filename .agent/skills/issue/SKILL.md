# SKILL: Issue作成

## 概要

Conventional Commitsのtypeに対応したラベルを付与し、GitHub MCPサーバー経由でIssueを作成するスキル。

---

## Issueタイトルのフォーマット

```
<type>(<scope>): <タイトル>
```

Conventional Commitsの `type` と `scope` をそのままタイトルのプレフィックスとして使用する。

---

## type・scope一覧

commit.skill.md の type一覧・scope一覧に準ずる。

---

## ラベル対応表

| type | ラベル |
|---|---|
| `feat` | `enhancement` |
| `fix` | `bug` |
| `docs` | `documentation` |
| `style` | `style` |
| `refactor` | `refactor` |
| `test` | `test` |
| `chore` | `chore` |
| `perf` | `performance` |
| `ci` | `ci` |
| `build` | `build` |

---

## 本文のフォーマット

```markdown
## 概要

<このIssueで対応する内容を日本語で簡潔に記述>

## 背景・目的

<なぜこの対応が必要かを日本語で記述>

## 対応内容

- [ ] <タスク1>
- [ ] <タスク2>

## 備考

<補足情報があれば記述（任意）>
```

---

## ルール

- タイトルは日本語で記述する
- タイトルは50文字以内に収める
- 本文は日本語で記述する
- 対応内容はチェックボックス形式で記述する
- 対応するラベルを必ず付与する

---

## 手順

1. 対応内容を確認し、適切な `type` と `scope` を選定する
2. タイトルと本文を上記フォーマットで組み立てる
3. GitHub MCPサーバーの `create_issue` ツールを使用してIssueを作成する

---

## 例

```
feat(entities): 天気APIフェッチ関数を実装する
```

```markdown
## 概要

Open-Meteoの/v1/forecastエンドポイントに対して、hourly/dailyを切り替えてフェッチする関数を実装する。

## 背景・目的

都市・指標・期間の選択に応じて適切なAPIパラメータを組み立て、型安全にレスポンスを取得する必要がある。

## 対応内容

- [ ] fetchHourlyWeather関数の実装
- [ ] fetchDailyWeather関数の実装
- [ ] HourlyResponse・DailyResponse型の定義
- [ ] ユニットテストの作成

## 備考

単位変換はAPIパラメータでは行わず、フロント側のunit-converter.tsで処理する。
```