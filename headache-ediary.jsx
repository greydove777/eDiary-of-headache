import { useState, useEffect, useCallback } from "react";

const SYMPTOMS = ["噁心或嘔吐", "怕光", "怕吵", "搏動性疼痛", "單側頭痛", "活動使頭痛加劇"];
const MEDICATIONS = ["未服藥", "布洛芬", "普拿疼／乙醯胺酚", "阿斯匹靈", "舒馬曲坦", "利紮曲坦", "萘普生", "其他"];
const DIZZINESS_LEVELS = ["輕微", "中等", "嚴重"];

const todayInfo = () => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
};

const defaultDayEntry = () => ({
  morning: "", afternoon: "", evening: "",
  symptoms: [],
  duration: "",
  medication: "未服藥", medicationEffect: "",
  stress: "",
  exercise: "",
  dizzy: false,
  dizzyLevel: "",
});

const C = {
  bg: "linear-gradient(160deg, #e8f5fb 0%, #d2eaf8 50%, #bcdff5 100%)",
  card: "rgba(255,255,255,0.82)",
  cardBorder: "rgba(74,154,191,0.18)",
  primary: "#2a82aa",
  primaryLight: "#4a9abf",
  text: "#1a3a52",
  textMid: "#4a7a9a",
  textLight: "#7aaac8",
  pillActive: "rgba(74,154,191,0.2)",
  pillActiveBorder: "#4a9abf",
  pillActiveText: "#1a5a7a",
  pillText: "#5a8aaa",
  pillBorder: "rgba(74,138,176,0.25)",
  pillBg: "rgba(255,255,255,0.7)",
  green: "#2a9a6a", orange: "#e09020", red: "#d04040",
};
const FF = "'Microsoft JhengHei','Noto Sans TC','PingFang TC',sans-serif";

const painColor = (v) => {
  const n = parseInt(v);
  if (!n) return C.textLight;
  if (n <= 3) return C.green;
  if (n <= 6) return C.orange;
  return C.red;
};
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
const monthKey = (y, m) => `${y}-${String(m).padStart(2, "0")}`;

// ══════════════════════════════
//  帳號管理
// ══════════════════════════════
const getAccounts = () => {
  try { return JSON.parse(localStorage.getItem("hd-accounts") || "{}"); } catch { return {}; }
};
const saveAccounts = (acc) => {
  try { localStorage.setItem("hd-accounts", JSON.stringify(acc)); } catch {}
};
const hashPass = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return String(h);
};

// ══════════════════════════════
//  登入 / 註冊 畫面
// ══════════════════════════════
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");

  const S = {
    root: { minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FF, padding: 24 },
    card: { background: "rgba(255,255,255,0.88)", border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: 32, width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(74,154,191,0.12)" },
    input: { width: "100%", background: "rgba(255,255,255,0.9)", border: `1px solid rgba(74,138,176,0.3)`, borderRadius: 10, color: C.text, padding: "12px 14px", fontSize: 15, fontFamily: FF, boxSizing: "border-box", marginBottom: 12 },
    btn: (col) => ({ width: "100%", padding: "13px", background: `linear-gradient(135deg,${col === "blue" ? C.primaryLight + "," + C.primary : "#3aaa7a,#2a8a5a"})`, border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontFamily: FF, cursor: "pointer", marginBottom: 10, boxShadow: "0 3px 12px rgba(42,130,170,0.2)" }),
    err: { color: C.red, fontSize: 12, marginBottom: 10, textAlign: "center" },
    link: { color: C.primary, fontSize: 13, textAlign: "center", cursor: "pointer", textDecoration: "underline" },
  };

  const handleLogin = () => {
    setErr("");
    if (!name.trim() || !pass) { setErr("請輸入姓名與密碼"); return; }
    const accs = getAccounts();
    const key = name.trim().toLowerCase();
    if (!accs[key]) { setErr("找不到此帳號，請先註冊"); return; }
    if (accs[key].hash !== hashPass(pass)) { setErr("密碼錯誤"); return; }
    onLogin(key, accs[key].displayName);
  };

  const handleRegister = () => {
    setErr("");
    if (!name.trim() || !pass) { setErr("請輸入姓名與密碼"); return; }
    if (pass.length < 4) { setErr("密碼至少需要 4 個字元"); return; }
    if (pass !== pass2) { setErr("兩次密碼不一致"); return; }
    const accs = getAccounts();
    const key = name.trim().toLowerCase();
    if (accs[key]) { setErr("此姓名已被使用，請換一個"); return; }
    accs[key] = { displayName: name.trim(), hash: hashPass(pass) };
    saveAccounts(accs);
    onLogin(key, name.trim());
  };

  return (
    <div style={S.root}>
      <div style={S.card}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48 }}>🧠</div>
          <div style={{ fontSize: 22, fontWeight: "bold", color: C.primary, marginTop: 8 }}>頭痛日記</div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>台灣頭痛學會建議格式</div>
        </div>

        {err && <div style={S.err}>{err}</div>}

        <input style={S.input} placeholder="姓名" value={name} onChange={e => setName(e.target.value)} />
        <input style={S.input} type="password" placeholder="密碼" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : null)} />
        {mode === "register" && (
          <input style={S.input} type="password" placeholder="確認密碼" value={pass2} onChange={e => setPass2(e.target.value)} />
        )}

        {mode === "login" ? (
          <>
            <button style={S.btn("blue")} onClick={handleLogin}>登入</button>
            <div style={S.link} onClick={() => { setMode("register"); setErr(""); }}>還沒有帳號？點此註冊</div>
          </>
        ) : (
          <>
            <button style={S.btn("green")} onClick={handleRegister}>建立帳號</button>
            <div style={S.link} onClick={() => { setMode("login"); setErr(""); }}>已有帳號？點此登入</div>
          </>
        )}
      </div>
      <div style={{ fontSize: 10, color: C.textLight, marginTop: 16, textAlign: "center" }}>
        資料僅儲存在此裝置，不會上傳至任何伺服器
      </div>
    </div>
  );
}

// ══════════════════════════════
//  主日記 App
// ══════════════════════════════
export default function HeadacheDiary() {
  const [user, setUser] = useState(null); // { id, name }
  const [view, setView] = useState("calendar");
  const t = todayInfo();
  const [year, setYear] = useState(t.year);
  const [month, setMonth] = useState(t.month);
  const [selectedDay, setSelectedDay] = useState(t.day);
  const [monthData, setMonthData] = useState({});
  const [nextVisit, setNextVisit] = useState("");

  // 嘗試自動登入（記住上次登入）
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hd-current-user");
      if (saved) { const u = JSON.parse(saved); setUser(u); }
    } catch {}
  }, []);

  const handleLogin = (id, name) => {
    const u = { id, name };
    setUser(u);
    try { localStorage.setItem("hd-current-user", JSON.stringify(u)); } catch {}
  };

  const handleLogout = () => {
    setUser(null);
    try { localStorage.removeItem("hd-current-user"); } catch {}
  };

  const userKey = (suffix) => user ? `hd-${user.id}-${suffix}` : null;
  const key = monthKey(year, month);

  useEffect(() => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(userKey(`data-${key}`));
      setMonthData(saved ? JSON.parse(saved) : {});
      const nv = localStorage.getItem(userKey(`nv-${key}`));
      setNextVisit(nv || "");
    } catch {}
  }, [key, user]);

  const saveDay = useCallback((day, data) => {
    if (!user) return;
    const updated = { ...monthData, [day]: data };
    setMonthData(updated);
    try { localStorage.setItem(userKey(`data-${key}`), JSON.stringify(updated)); } catch {}
  }, [monthData, key, user]);

  const saveNextVisit = (val) => {
    setNextVisit(val);
    try { localStorage.setItem(userKey(`nv-${key}`), val); } catch {}
  };

  const getDayEntry = (day) => monthData[day] || defaultDayEntry();
  const currentEntry = getDayEntry(selectedDay);
  const updateEntry = (field, value) => saveDay(selectedDay, { ...currentEntry, [field]: value });
  const toggleSymptom = (s) => {
    const list = currentEntry.symptoms || [];
    updateEntry("symptoms", list.includes(s) ? list.filter(x => x !== s) : [...list, s]);
  };

  const hasData = (day) => {
    const e = monthData[day];
    return e && (e.morning || e.afternoon || e.evening || (e.symptoms && e.symptoms.length > 0));
  };
  const maxPain = (day) => {
    const e = monthData[day];
    if (!e) return 0;
    return Math.max(parseInt(e.morning) || 0, parseInt(e.afternoon) || 0, parseInt(e.evening) || 0);
  };
  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();

  const prevMonth = () => { if (month === 1) { setYear(y => y - 1); setMonth(12); } else setMonth(m => m - 1); setSelectedDay(1); };
  const nextMonth = () => { if (month === 12) { setYear(y => y + 1); setMonth(1); } else setMonth(m => m + 1); setSelectedDay(1); };

  const headacheDays = Object.entries(monthData).filter(([, e]) => parseInt(e.morning) > 0 || parseInt(e.afternoon) > 0 || parseInt(e.evening) > 0).length;
  const medDays = Object.values(monthData).filter(e => e.medication && e.medication !== "未服藥").length;
  const allPains = Object.values(monthData).flatMap(e => [parseInt(e.morning) || 0, parseInt(e.afternoon) || 0, parseInt(e.evening) || 0].filter(v => v > 0));
  const avgPain = allPains.length ? (allPains.reduce((a, b) => a + b, 0) / allPains.length).toFixed(1) : "–";
  const symptomCount = {};
  Object.values(monthData).forEach(e => (e.symptoms || []).forEach(s => symptomCount[s] = (symptomCount[s] || 0) + 1));
  const topSymptoms = Object.entries(symptomCount).sort((a, b) => b[1] - a[1]);
  const dizzyDays = Object.values(monthData).filter(e => e.dizzy).length;

  const S = {
    root: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FF, display: "flex", flexDirection: "column", alignItems: "center" },
    header: { width: "100%", maxWidth: 520, padding: "16px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    main: { width: "100%", maxWidth: 520, padding: "16px 20px 32px", flex: 1 },
    card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20, marginBottom: 14, boxShadow: "0 2px 14px rgba(74,154,191,0.08)" },
    navBtn: a => ({ background: a ? "rgba(74,154,191,0.16)" : "transparent", border: "none", color: a ? C.primary : C.textLight, fontSize: 13, padding: "6px 12px", cursor: "pointer", borderRadius: 6, fontFamily: FF }),
    label: { fontSize: 11, letterSpacing: "0.08em", color: C.textLight, marginBottom: 6, display: "block", textTransform: "uppercase" },
    input: { background: "rgba(255,255,255,0.85)", border: `1px solid rgba(74,138,176,0.3)`, borderRadius: 8, color: C.text, padding: "9px 12px", fontSize: 15, fontFamily: FF, boxSizing: "border-box" },
    pill: a => ({ display: "inline-block", padding: "7px 14px", margin: "3px", borderRadius: 20, border: `1px solid ${a ? C.pillActiveBorder : C.pillBorder}`, background: a ? C.pillActive : C.pillBg, color: a ? C.pillActiveText : C.pillText, fontSize: 13, cursor: "pointer", fontFamily: FF }),
    primaryBtn: { background: `linear-gradient(135deg,${C.primaryLight},${C.primary})`, border: "none", borderRadius: 10, color: "#fff", padding: "12px 24px", fontSize: 15, fontFamily: FF, cursor: "pointer", boxShadow: "0 3px 12px rgba(42,130,170,0.22)" },
    backBtn: { background: "rgba(255,255,255,0.7)", border: `1px solid rgba(74,138,176,0.25)`, borderRadius: 10, color: C.textMid, padding: "10px 18px", fontSize: 14, fontFamily: FF, cursor: "pointer" },
  };

  // ── PDF 匯出 ──
  const exportPDF = () => {
    const rows = Array.from({ length: totalDays }, (_, i) => i + 1).map(day => ({ day, ...(monthData[day] || defaultDayEntry()) }));
    const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"/>
<title>頭痛日記 ${year}年${month}月 - ${user?.name}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Microsoft JhengHei','PingFang TC',sans-serif;font-size:11px;color:#1a3a52}
@page{size:A4 landscape;margin:10mm 8mm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #2a82aa}
.title{font-size:18px;font-weight:bold;color:#2a82aa}.subtitle{font-size:10px;color:#7aaac8;margin-top:2px}
.meta{text-align:right;font-size:11px;color:#4a7a9a;line-height:1.8}
.summary{display:flex;gap:12px;margin-bottom:8px}
.stat{background:#e8f5fb;border:1px solid #b0d8f0;border-radius:6px;padding:5px 12px;text-align:center}
.stat-val{font-size:16px;font-weight:bold;color:#2a82aa}.stat-lbl{font-size:9px;color:#7aaac8}
table{width:100%;border-collapse:collapse}
th{background:#2a82aa;color:#fff;padding:5px 3px;text-align:center;font-size:10px;font-weight:bold;border:1px solid #1a6a8a}
td{padding:4px 3px;text-align:center;border:1px solid #c0d8e8;font-size:10px;vertical-align:middle}
tr:nth-child(even) td{background:#f0f8fd}
.day-col{font-weight:bold;color:#2a82aa;background:#e8f5fb!important;width:26px}
.p0{color:#aaa}.pl{color:#2a9a6a;font-weight:bold}.pm{color:#e09020;font-weight:bold}.ph{color:#d04040;font-weight:bold}
.check{color:#2a82aa}.footer{margin-top:8px;font-size:9px;color:#7aaac8;text-align:center;border-top:1px solid #c0d8e8;padding-top:6px}
</style></head><body>
<div class="header">
  <div><div class="title">🧠 頭痛日記</div><div class="subtitle">內容根據台灣頭痛學會之建議制定</div></div>
  <div class="meta"><div><b>${user?.name} · ${year}年${month}月</b></div>${nextVisit ? `<div>下次回診：${nextVisit}</div>` : ""}<div>列印：${new Date().toLocaleDateString("zh-TW")}</div></div>
</div>
<div class="summary">
  <div class="stat"><div class="stat-val">${headacheDays}</div><div class="stat-lbl">頭痛天數</div></div>
  <div class="stat"><div class="stat-val">${avgPain}</div><div class="stat-lbl">平均疼痛</div></div>
  <div class="stat"><div class="stat-val">${medDays}</div><div class="stat-lbl">用藥天數</div></div>
  <div class="stat"><div class="stat-val">${dizzyDays}</div><div class="stat-lbl">頭暈天數</div></div>
  <div class="stat"><div class="stat-val">${allPains.length ? Math.max(...allPains) : "–"}</div><div class="stat-lbl">最高疼痛</div></div>
</div>
<table><thead><tr>
  <th>日</th><th>早上</th><th>下午</th><th>晚上</th>
  <th>噁心嘔吐</th><th>怕光</th><th>怕吵</th><th>搏動性</th><th>單側</th><th>活動加劇</th>
  <th>持續(時)</th><th>止痛藥</th><th>藥效</th><th>頭暈</th><th>壓力</th><th>運動項目</th>
</tr></thead><tbody>
${rows.map(({ day, morning, afternoon, evening, symptoms, duration, medication, medicationEffect, dizzy, dizzyLevel, stress, exercise }) => {
  const pc = v => { const n = parseInt(v); if (!n) return "p0"; if (n <= 3) return "pl"; if (n <= 6) return "pm"; return "ph"; };
  const sym = symptoms || [];
  return `<tr>
    <td class="day-col">${day}</td>
    <td class="${pc(morning)}">${morning || "0"}</td>
    <td class="${pc(afternoon)}">${afternoon || "0"}</td>
    <td class="${pc(evening)}">${evening || "0"}</td>
    <td>${sym.includes("噁心或嘔吐") ? '<span class="check">✓</span>' : ""}</td>
    <td>${sym.includes("怕光") ? '<span class="check">✓</span>' : ""}</td>
    <td>${sym.includes("怕吵") ? '<span class="check">✓</span>' : ""}</td>
    <td>${sym.includes("搏動性疼痛") ? '<span class="check">✓</span>' : ""}</td>
    <td>${sym.includes("單側頭痛") ? '<span class="check">✓</span>' : ""}</td>
    <td>${sym.includes("活動使頭痛加劇") ? '<span class="check">✓</span>' : ""}</td>
    <td>${duration || ""}</td>
    <td style="font-size:9px">${medication !== "未服藥" ? medication : ""}</td>
    <td>${medicationEffect || ""}</td>
    <td>${dizzy ? (dizzyLevel || "是") : ""}</td>
    <td>${stress || ""}</td>
    <td style="font-size:9px;text-align:left;padding-left:4px">${exercise || ""}</td>
  </tr>`;
}).join("")}
</tbody></table>
<div class="footer">僅供個人記錄使用，不可取代求醫之需要，亦不能作為自我診斷或選擇治療的依據。</div>
</body></html>`;
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  // ── 月曆 ──
  const CalendarView = () => (
    <div>
      <div style={{ ...S.card, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={prevMonth} style={{ ...S.backBtn, padding: "6px 14px", fontSize: 16 }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: "bold", color: C.primary }}>{year} 年 {month} 月</div>
            <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>
              下次回診：
              <input type="date" value={nextVisit} onChange={e => saveNextVisit(e.target.value)}
                style={{ ...S.input, display: "inline", width: "auto", padding: "2px 8px", fontSize: 12, marginLeft: 6 }} />
            </div>
          </div>
          <button onClick={nextMonth} style={{ ...S.backBtn, padding: "6px 14px", fontSize: 16 }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
          {["日","一","二","三","四","五","六"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, color: C.textLight, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
            const mp = maxPain(day);
            const has = hasData(day);
            const isToday = day === t.day && month === t.month && year === t.year;
            const isSelected = day === selectedDay;
            const e = monthData[day] || {};
            const bg = has ? (mp <= 3 ? "rgba(42,154,106,0.15)" : mp <= 6 ? "rgba(224,144,32,0.15)" : "rgba(208,64,64,0.15)") : "rgba(255,255,255,0.6)";
            const border = isSelected ? C.primary : has ? (mp <= 3 ? C.green : mp <= 6 ? C.orange : C.red) : "rgba(74,138,176,0.2)";
            return (
              <div key={day} onClick={() => { setSelectedDay(day); setView("entry"); }}
                style={{ textAlign: "center", padding: "5px 2px", borderRadius: 10, background: bg, border: `2px solid ${border}`, cursor: "pointer" }}>
                <div style={{ fontSize: 13, fontWeight: isToday ? "bold" : "normal", color: isSelected ? C.primary : C.text }}>{day}</div>
                {has && <div style={{ fontSize: 10, color: mp <= 3 ? C.green : mp <= 6 ? C.orange : C.red, fontWeight: "bold" }}>{mp || "✓"}</div>}
                {e.dizzy && <div style={{ fontSize: 9, color: "#7a5aaa" }}>暈</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[["輕微 1-3", C.green], ["中等 4-6", C.orange], ["嚴重 7-10", C.red], ["頭暈", "#7a5aaa"]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textMid }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c, opacity: 0.7 }} />{l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[
          { val: headacheDays, label: "頭痛天數", color: C.primary },
          { val: avgPain, label: "平均疼痛", color: headacheDays ? painColor(parseFloat(avgPain)) : C.textLight },
          { val: medDays, label: "用藥天數", color: "#7a5aaa" },
          { val: dizzyDays, label: "頭暈天數", color: "#5a7aaa" },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ flex: 1, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "12px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: "bold", color }}>{val}</div>
            <div style={{ fontSize: 9, color: C.textLight, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
      <button style={{ ...S.primaryBtn, width: "100%" }} onClick={() => { setSelectedDay(t.day); setView("entry"); }}>
        ＋ 填寫今日紀錄
      </button>
    </div>
  );

  // ── 單日填寫 ──
  const EntryView = () => {
    const e = currentEntry;
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button style={S.backBtn} onClick={() => setView("calendar")}>← 返回</button>
          <div>
            <div style={{ fontSize: 17, fontWeight: "bold", color: C.primary }}>{year} 年 {month} 月 {selectedDay} 日</div>
            <div style={{ fontSize: 11, color: C.textLight }}>請填寫當日頭痛狀況</div>
          </div>
        </div>

        {/* 疼痛 */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: "bold", color: C.text }}>是否有頭痛</span>
            <span style={{ fontSize: 11, color: C.textLight }}>0無痛 ～ 10最嚴重</span>
          </div>
          {[["morning", "早上"], ["afternoon", "下午"], ["evening", "晚上"]].map(([field, label]) => (
            <div key={field} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, fontSize: 13, color: C.textMid, flexShrink: 0 }}>{label}</div>
              <input type="range" min={0} max={10} value={parseInt(e[field]) || 0}
                onChange={ev => updateEntry(field, ev.target.value)}
                style={{ flex: 1, accentColor: painColor(e[field]) }} />
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: parseInt(e[field]) ? painColor(e[field]) + "22" : "rgba(74,138,176,0.08)", border: `2px solid ${parseInt(e[field]) ? painColor(e[field]) : "rgba(74,138,176,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", color: painColor(e[field]), flexShrink: 0 }}>
                {e[field] || 0}
              </div>
            </div>
          ))}
        </div>

        {/* 伴隨症狀 */}
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: C.text, marginBottom: 10 }}>伴隨症狀</div>
          <div>{SYMPTOMS.map(s => <button key={s} style={S.pill((e.symptoms || []).includes(s))} onClick={() => toggleSymptom(s)}>{s}</button>)}</div>
        </div>

        {/* 持續時間 */}
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: C.text, marginBottom: 10 }}>頭痛持續時間（小時）</div>
          <input type="number" min={0} max={72} step={0.5} placeholder="例：4" value={e.duration}
            onChange={ev => updateEntry("duration", ev.target.value)}
            style={{ ...S.input, width: "100%" }} />
        </div>

        {/* 其他 */}
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: C.text, marginBottom: 14 }}>其他狀況記錄</div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>有服用止痛藥</label>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {MEDICATIONS.map(m => <button key={m} style={S.pill(e.medication === m)} onClick={() => updateEntry("medication", m)}>{m}</button>)}
            </div>
          </div>
          {e.medication !== "未服藥" && (
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>止痛藥效果</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["有效", C.green], ["部分有效", C.orange], ["無效", C.red]].map(([val, col]) => (
                  <button key={val} onClick={() => updateEntry("medicationEffect", val)}
                    style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: `1px solid ${e.medicationEffect === val ? col : C.pillBorder}`, background: e.medicationEffect === val ? col + "22" : C.pillBg, color: e.medicationEffect === val ? col : C.pillText, fontSize: 13, cursor: "pointer", fontFamily: FF, textAlign: "center" }}>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>壓力指數（1–10）</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="range" min={0} max={10} value={parseInt(e.stress) || 0}
                onChange={ev => updateEntry("stress", ev.target.value)}
                style={{ flex: 1, accentColor: C.primary }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(74,154,191,0.12)", border: `2px solid ${C.primaryLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", color: C.primary }}>
                {e.stress || 0}
              </div>
            </div>
          </div>
          <div>
            <label style={S.label}>運動項目</label>
            <input type="text" placeholder="例：慢跑30分、瑜伽、無" value={e.exercise}
              onChange={ev => updateEntry("exercise", ev.target.value)}
              style={{ ...S.input, width: "100%" }} />
          </div>
        </div>

        {/* ── 頭暈欄位 ── */}
        <div style={{ ...S.card, border: `1px solid ${e.dizzy ? "rgba(122,90,170,0.4)" : C.cardBorder}`, background: e.dizzy ? "rgba(122,90,170,0.06)" : C.card }}>
          <div style={{ fontSize: 15, fontWeight: "bold", color: C.text, marginBottom: 14 }}>是否會頭暈</div>
          <div style={{ display: "flex", gap: 12, marginBottom: e.dizzy ? 14 : 0 }}>
            {[["是", true], ["否", false]].map(([label, val]) => (
              <button key={label} onClick={() => { updateEntry("dizzy", val); if (!val) updateEntry("dizzyLevel", ""); }}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${e.dizzy === val ? (val ? "#7a5aaa" : C.green) : C.pillBorder}`, background: e.dizzy === val ? (val ? "rgba(122,90,170,0.12)" : "rgba(42,154,106,0.1)") : C.pillBg, color: e.dizzy === val ? (val ? "#7a5aaa" : C.green) : C.pillText, fontSize: 16, fontWeight: "bold", cursor: "pointer", fontFamily: FF, textAlign: "center" }}>
                {label}
              </button>
            ))}
          </div>
          {e.dizzy && (
            <div>
              <label style={{ ...S.label, color: "#9a7acc" }}>嚴重程度</label>
              <div style={{ display: "flex", gap: 8 }}>
                {DIZZINESS_LEVELS.map((lv, i) => {
                  const cols = [C.green, C.orange, C.red];
                  const col = cols[i];
                  return (
                    <button key={lv} onClick={() => updateEntry("dizzyLevel", lv)}
                      style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: `2px solid ${e.dizzyLevel === lv ? col : C.pillBorder}`, background: e.dizzyLevel === lv ? col + "22" : C.pillBg, color: e.dizzyLevel === lv ? col : C.pillText, fontSize: 14, fontWeight: e.dizzyLevel === lv ? "bold" : "normal", cursor: "pointer", fontFamily: FF, textAlign: "center" }}>
                      {lv}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...S.backBtn, flex: 1 }} disabled={selectedDay <= 1} onClick={() => setSelectedDay(d => d - 1)}>‹ 前一天</button>
          <button style={{ ...S.primaryBtn, flex: 1 }} disabled={selectedDay >= totalDays} onClick={() => setSelectedDay(d => d + 1)}>後一天 ›</button>
        </div>
      </div>
    );
  };

  // ── 統計 ──
  const StatsView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: C.primary }}>{year} 年 {month} 月 統計</div>
        <button onClick={exportPDF} style={{ background: "linear-gradient(135deg,#3aaa7a,#2a8a5a)", border: "none", borderRadius: 8, color: "#fff", padding: "9px 14px", fontSize: 13, fontFamily: FF, cursor: "pointer" }}>
          🖨️ 匯出PDF
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { val: headacheDays, label: "頭痛天數", color: C.primary },
          { val: avgPain, label: "平均疼痛", color: headacheDays ? painColor(parseFloat(avgPain)) : C.textLight },
          { val: medDays, label: "用藥天數", color: "#7a5aaa" },
          { val: dizzyDays, label: "頭暈天數", color: "#5a7aaa" },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ flex: "1 1 80px", background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: "bold", color }}>{val}</div>
            <div style={{ fontSize: 10, color: C.textLight, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
      {topSymptoms.length > 0 && (
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: C.text, marginBottom: 12 }}>常見伴隨症狀</div>
          {topSymptoms.map(([s, c]) => (
            <div key={s} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: C.text }}>{s}</span>
                <span style={{ fontSize: 12, color: C.textLight }}>{c} 次</span>
              </div>
              <div style={{ height: 4, background: "rgba(74,138,176,0.12)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(c / (topSymptoms[0]?.[1] || 1)) * 100}%`, background: C.primaryLight, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {Object.entries(monthData).filter(([, e]) => e.morning || e.afternoon || e.evening).length > 0 && (
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: C.text, marginBottom: 12 }}>每日紀錄</div>
          {Object.entries(monthData).filter(([, e]) => e.morning || e.afternoon || e.evening).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([day, e]) => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(74,138,176,0.08)", cursor: "pointer" }}
              onClick={() => { setSelectedDay(parseInt(day)); setView("entry"); }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: painColor(maxPain(parseInt(day))) + "20", border: `2px solid ${painColor(maxPain(parseInt(day)))}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", color: painColor(maxPain(parseInt(day))), flexShrink: 0 }}>{day}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.text }}>
                  早{e.morning || 0} · 午{e.afternoon || 0} · 晚{e.evening || 0}
                  {e.duration ? ` · ${e.duration}小時` : ""}
                  {e.dizzy ? ` · 頭暈${e.dizzyLevel ? "（" + e.dizzyLevel + "）" : ""}` : ""}
                </div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{(e.symptoms || []).slice(0, 3).join("、") || "無症狀"}</div>
              </div>
              <span style={{ color: C.textLight }}>›</span>
            </div>
          ))}
        </div>
      )}
      {headacheDays === 0 && <div style={{ ...S.card, textAlign: "center", padding: 32 }}><p style={{ color: C.textLight, margin: 0 }}>本月尚無頭痛紀錄。</p></div>}
    </div>
  );

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: C.primary, fontWeight: "bold" }}>🧠 頭痛日記</span>
          <span style={{ fontSize: 12, color: C.textLight }}>· {user.name}</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[["calendar", "月曆"], ["stats", "統計"]].map(([v, l]) => (
            <button key={v} style={S.navBtn(view === v)} onClick={() => setView(v)}>{l}</button>
          ))}
          <button style={{ ...S.navBtn(false), background: "rgba(42,150,100,0.1)", color: "#2a8a5a" }} onClick={exportPDF}>🖨️</button>
          <button onClick={handleLogout} style={{ ...S.navBtn(false), fontSize: 11, color: C.red + "cc" }}>登出</button>
        </div>
      </div>
      <div style={S.main}>
        {view === "calendar" && <CalendarView />}
        {view === "entry" && <EntryView />}
        {view === "stats" && <StatsView />}
      </div>
      <div style={{ padding: "12px 20px", fontSize: 11, color: C.textLight, textAlign: "center" }}>
        內容根據台灣頭痛學會之建議制定 · 僅供個人記錄，非醫療建議
      </div>
    </div>
  );
}
