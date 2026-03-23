# 頭痛日記 PWA — 部署說明

## 📁 專案檔案

```
headache-pwa/
├── index.html      ← 主頁面（完整 App）
├── manifest.json   ← PWA 設定（名稱、圖示、顏色）
├── sw.js           ← Service Worker（離線支援）
├── icon-192.png    ← App 圖示（小）
└── icon-512.png    ← App 圖示（大）
```

---

## 🚀 部署步驟（使用 Vercel，免費）

### 第一步：上傳到 GitHub

1. 前往 [github.com](https://github.com) 並登入
2. 點右上角 **「＋」→「New repository」**
3. 命名（例如 `headache-diary`），選 **Public**，點 **Create**
4. 把以上 5 個檔案全部上傳（拖曳到頁面即可）

### 第二步：部署到 Vercel

1. 前往 [vercel.com](https://vercel.com)，用 GitHub 帳號登入
2. 點 **「Add New Project」**
3. 選剛才建立的 repository
4. 直接點 **「Deploy」**（不需要任何設定）
5. 幾秒後取得網址，例如：`https://headache-diary.vercel.app`

---

## 📱 手機安裝方式

### iPhone（Safari 瀏覽器）
1. 用 **Safari** 打開你的網址
2. 點下方工具列的 **分享按鈕** 📤
3. 向下滑，選 **「加入主畫面」**
4. 確認名稱，點 **「新增」**
5. 完成！桌面出現「頭痛日記」App 圖示 ✓

### Android（Chrome 瀏覽器）
1. 用 **Chrome** 打開你的網址
2. 瀏覽器會自動彈出「**安裝應用程式**」提示
3. 點「安裝」即可
4. 若無提示，點右上角 **⋮ → 新增至主螢幕**

---

## 💾 資料儲存

- 所有紀錄儲存在手機本地（localStorage）
- **不會上傳到任何伺服器**，完全私密
- 清除瀏覽器快取會刪除資料，請定期備份

---

## ✅ 功能清單

- 新增頭痛紀錄（8步驟引導）
- 疼痛程度、疼痛部位、伴隨症狀
- 頭暈程度評分
- 誘發因素、用藥紀錄
- 情緒與睡眠記錄
- 歷史紀錄瀏覽（按月篩選）
- 統計分析（平均疼痛、發作次數、誘發因素排名）
- 離線使用支援

---

*僅供個人記錄使用，非醫療建議*
