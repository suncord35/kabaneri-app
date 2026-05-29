"use client";

import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

// 解析値：ボーナス初当り確率
const bonusSettingsData = [
  { setting: 1, rate: 254.2 },
  { setting: 2, rate: 242.3 },
  { setting: 3, rate: 239.6 },
  { setting: 4, rate: 214.0 },
  { setting: 5, rate: 203.2 },
  { setting: 6, rate: 195.1 },
];

// 解析値：ST確率
const stSettingsData = [
  { setting: 1, rate: 422.5 },
  { setting: 2, rate: 405.9 },
  { setting: 3, rate: 398.7 },
  { setting: 4, rate: 357.2 },
  { setting: 5, rate: 332.6 },
  { setting: 6, rate: 318.5 },
];

// 下段ベル
const bellSettingsData = [
  { setting: 1, rate: 121.1 },
  { setting: 2, rate: 114.4 },
  { setting: 3, rate: 112.8 },
  { setting: 4, rate: 106.2 },
  { setting: 5, rate: 104.2 },
  { setting: 6, rate: 99.1 },
];

interface HistoryItem {
  inputGames: number;
  actualGames: number;
  type: "episode" | "suruga" | "surugaST";
}

function CounterInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setValue((prev) => Math.max(0, prev - 1))}
          className="w-12 h-12 rounded-lg border text-2xl font-bold bg-neutral-300"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Math.max(0, Number(e.target.value) || 0))}
          className="w-32 border rounded-lg p-3 text-center text-2xl font-bold"
        />
        <button
          type="button"
          onClick={() => setValue((prev) => prev + 1)}
          className="w-12 h-12 rounded-lg bg-stone-950 text-white text-2xl font-bold"
        >
          ＋
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [inputGames, setInputGames] = useState("");
  const [games, setGames] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [memberCount, setMemberCount] = useState(0);
  const [mizugiCount, setMizugiCount] = useState(0);
  const [maleVoiceCount, setMaleVoiceCount] = useState(0);
  const [femaleVoiceCount, setFemaleVoiceCount] = useState(0);
  const [keishiWeakCount, setKeishiWeakCount] = useState(0);
  const [keishiMiddleCount, setKeishiMiddleCount] = useState(0);
  const [keishiStrongCount, setKeishiStrongCount] = useState(0);
  const [mumeiSpecialCount, setMumeiSpecialCount] = useState(0);
  const [noVoiceCount, setNoVoiceCount] = useState(0);
  const [tsuranukiCount, setTsuranukiCount] = useState(0);
  const [tanjuCount, setTanjuCount] = useState(0);
  const [jiketsuCount, setJiketsuCount] = useState(0);
  const [kendamaCount, setKendamaCount] = useState(0);
  const [katanaCount, setKatanaCount] = useState(0);
  const [yumiCount, setYumiCount] = useState(0);
  const [agehaCount, setAgehaCount] = useState(0);
  const [shokichiCount, setShokichiCount] = useState(0);
  const [chukichiCount, setChukichiCount] = useState(0);
  const [daikichiCount, setDaikichiCount] = useState(0);
  const [tetsugetaCount, setTetsugetaCount] = useState(0);
  const [bellsCount, setBellsCount] = useState(0);

  const [showVoice, setShowVoice] = useState(false);
  const [showOmikuji, setShowOmikuji] = useState(false);
  const [showEndingScreen, setShowEndingScreen] = useState(false);

  const addHistory = (type: "episode" | "suruga" | "surugaST") => {
    const currentInput = Number(inputGames);
    if (!inputGames || currentInput <= 0) return;

    const lastItem = history[history.length - 1];
    let actualGames = currentInput;

    if (lastItem && lastItem.type === "suruga") {
      if (currentInput <= lastItem.inputGames) {
        alert("液晶ゲーム数が前回の駿城ボーナス時より小さいです。");
        return;
      }
      actualGames = currentInput - lastItem.inputGames;
    }

    setHistory([...history, { inputGames: currentInput, actualGames, type }]);
    setInputGames("");
  };

  const popHistory = () => setHistory(history.slice(0, -1));

  const totalNormalGames = history.reduce((sum, item) => sum + item.actualGames, 0);
  const episodeBonus = history.filter(i => i.type === "episode").length;
  const surugaBonus = history.filter(i => i.type === "suruga").length;
  const surugaST = history.filter(i => i.type === "surugaST").length;
  const totalBonus = episodeBonus + surugaBonus;
  const totalST = episodeBonus + surugaST;

  const bonusRate = totalNormalGames > 0 && totalBonus > 0 ? (totalNormalGames / totalBonus).toFixed(1) : null;
  const stRate = totalNormalGames > 0 && totalST > 0 ? (totalNormalGames / totalST).toFixed(1) : null;
  const bellRate = Number(games) > 0 && bellsCount > 0 ? (Number(games) / bellsCount).toFixed(1) : null;

  const comparison = bonusSettingsData.map((item) => {
    let totalScore = 1; // 初期状態は全設定均等
    let multiplier = 1;

    if (bonusRate) {
      const diff = Math.abs(
        Number(bonusRate) - item.rate
      );

      totalScore += 1000 / Math.pow(diff + 10, 2);
    }
    if (stRate) {
      const stTarget = stSettingsData.find(s => s.setting === item.setting)?.rate || 0;
      const diff = Math.abs(Number(stRate) - stTarget);
      totalScore += 1000 / Math.pow(diff + 10, 2);
    }
    if (bellRate) {
      const bellTarget =
        bellSettingsData.find(
          b => b.setting === item.setting
        )?.rate || 0;

      const diff = Math.abs(
        Number(bellRate) - bellTarget
      );

      const score = 1000 / Math.pow(diff + 10, 2);
      const reliability = Math.min(Number(games) / 3000, 1);
      totalScore += score * reliability;
    }

    // 確定演出による multiplier 操作
    if (mizugiCount > 0 && item.setting !== 6) multiplier = 0;
    if (daikichiCount > 0 && item.setting !== 6) multiplier = 0;
    if (mumeiSpecialCount > 0 && item.setting === 1) multiplier = 0;
    if (shokichiCount > 0 && item.setting === 1) multiplier = 0;
    if (chukichiCount > 0 && [1, 2, 3].includes(item.setting)) multiplier = 0;
    if (noVoiceCount > 0 && ![5, 6].includes(item.setting)) multiplier = 0;
    if (kendamaCount > 0 && item.setting === 1) multiplier = 0;
    if (katanaCount > 0 && item.setting === 2) multiplier = 0;

    // 示唆による加点
    if (item.setting >= 4) totalScore += memberCount * 2 + yumiCount * 5 + agehaCount * 10;
    if ([1, 3, 5].includes(item.setting)) totalScore += maleVoiceCount * 2;
    if ([2, 4, 6].includes(item.setting)) totalScore += femaleVoiceCount * 2;
    if (item.setting >= 4) totalScore += keishiWeakCount * 3 + keishiMiddleCount * 6 + keishiStrongCount * 10;
    if (tsuranukiCount > 0 && item.setting === 4) totalScore *= 0.5;
    if (tanjuCount > 0 && item.setting === 3) totalScore *= 0.5;
    if (jiketsuCount > 0 && item.setting === 1) totalScore *= 0.5;

    return { setting: item.setting, totalScore: totalScore * multiplier };
  });

  const combinedTotal = comparison.reduce((sum, item) => sum + item.totalScore, 0);
  const finalProbability = comparison.map(item => ({
    ...item,
    probability: combinedTotal > 0 ? ((item.totalScore / combinedTotal) * 100).toFixed(1) : "0.0",
  }));

  const closestSetting =
    combinedTotal > 0
      ? finalProbability.reduce((p, c) =>
        Number(p.probability) >=
          Number(c.probability)
          ? p
          : c
      )
      : null;
  // 🛠️ 「ベル入力がある」か「ボーナス履歴がある」なら判定を表示
  const isReadyToDisplay = (Number(games) > 0 && bellsCount > 0) || totalNormalGames > 0;

  return (
    <main className="min-h-screen bg-neutral-100 p-6 text-neutral-800">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="font-bold mb-6 text-center">
          <span className="block text-3xl">スマスロ カバネリ</span>
          <span className="block text-[#00426D] text-2xl mt-1">設定判別ツール</span>
        </h1>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block mb-2 font-bold">総ゲーム数</label>
            <input type="number" value={games} onChange={(e) => setGames(e.target.value)} className="w-full border rounded-lg p-3 text-2xl font-bold" placeholder="0" />
          </div>
          <CounterInput label="🔔 下段ベル回数" value={bellsCount} setValue={setBellsCount} />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <label className="block mb-2 font-bold text-cyan-900 text-sm">💡 当選時の「液晶ゲーム数」を入力して該当するボタンを押してください</label>
          <input type="number" value={inputGames} onChange={(e) => setInputGames(e.target.value)} className="w-full border rounded-lg p-3 text-2xl font-bold text-center mb-3" placeholder="例: 250" />
          <div className="grid gap-2">
            <button onClick={() => addHistory("episode")} className="bg-rose-800 text-white font-bold p-3 rounded-lg shadow active:bg-red-700">エピボ (ST直行)</button>
            <button onClick={() => addHistory("surugaST")} className="bg-sky-900 text-white font-bold p-3 rounded-lg shadow active:bg-purple-700">駿城 ➔ 突破成功</button>
            <button onClick={() => addHistory("suruga")} className="bg-emerald-800 text-white font-bold p-3 rounded-lg shadow active:bg-amber-600">駿城 ➔ スルー失敗</button>
          </div>
          {history.length > 0 && <button onClick={popHistory} className="w-full text-xs text-gray-500 mt-3 text-right underline">直前の入力を消す</button>}
        </div>

        <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-3 rounded-lg border text-sm mb-6">
          <p>通常合計: <span className="font-bold">{totalNormalGames}</span> G</p>
          <p>ベル確率: <span className="font-bold text-amber-600">{bellRate ? `1/${bellRate}` : "-"}</span></p>
          <p>初当り: <span className="font-bold">{bonusRate ? `1/${bonusRate}` : "-"}</span></p>
          <p>ST確率: <span className="font-bold">{stRate ? `1/${stRate}` : "-"}</span></p>
        </div>

        {/* 演出メニュー（アコーディオン） */}
        <div className="space-y-4">
          <button className="w-full flex justify-between font-bold border-b border-[#00426D]/30 pb-2 text-[#00426D]">
            <span>📢 サンド目停止ボイス</span>
            <span>＋</span>
          </button>
          {showVoice && (
            <div className="space-y-1">
              <CounterInput
                label="男性キャラ"
                value={maleVoiceCount}
                setValue={setMaleVoiceCount}
              />

              <CounterInput
                label="女性キャラ"
                value={femaleVoiceCount}
                setValue={setFemaleVoiceCount}
              />

              <CounterInput
                label="景之ボイス（弱）「なぜ言わなかった……私をヒトだと！」"
                value={keishiWeakCount}
                setValue={setKeishiWeakCount}
              />

              <CounterInput
                label="景之ボイス（中）「私は……ヒトか、カバネか！？」"
                value={keishiMiddleCount}
                setValue={setKeishiMiddleCount}
              />

              <CounterInput
                label="景之ボイス（強）「今年は最後かな」"
                value={keishiStrongCount}
                setValue={setKeishiStrongCount}
              />

              <CounterInput
                label="無名特殊ボイス「やっぱりこの台……普通じゃないね」"
                value={mumeiSpecialCount}
                setValue={setMumeiSpecialCount}
              />

              <CounterInput
                label="ボイス非発生"
                value={noVoiceCount}
                setValue={setNoVoiceCount}
              />            </div>
          )}

          <button onClick={() => setShowOmikuji(!showOmikuji)} className="w-full flex justify-between font-bold border-b border-[#00426D]/30 pb-2 text-[#00426D]">
            <span>⛩️ アイテムくじ</span><span>{showOmikuji ? "−" : "＋"}</span>
          </button>
          {showOmikuji && (
            <div className="space-y-1">
              <CounterInput
                label="ツラヌキ筒"
                value={tsuranukiCount}
                setValue={setTsuranukiCount}
              />

              <CounterInput
                label="無名の短銃"
                value={tanjuCount}
                setValue={setTanjuCount}
              />

              <CounterInput
                label="自決袋"
                value={jiketsuCount}
                setValue={setJiketsuCount}
              />

              <CounterInput
                label="無名のけん玉"
                value={kendamaCount}
                setValue={setKendamaCount}
              />

              <CounterInput
                label="来栖の刀"
                value={katanaCount}
                setValue={setKatanaCount}
              />

              <CounterInput
                label="菖蒲の弓"
                value={yumiCount}
                setValue={setYumiCount}
              />

              <CounterInput
                label="ミヤマカラスアゲハ"
                value={agehaCount}
                setValue={setAgehaCount}
              />

              <CounterInput
                label="小吉(2以上濃厚)"
                value={shokichiCount}
                setValue={setShokichiCount}
              />

              <CounterInput
                label="中吉(4以上濃厚)"
                value={chukichiCount}
                setValue={setChukichiCount}
              />

              <CounterInput
                label="大吉(6濃厚🏆)"
                value={daikichiCount}
                setValue={setDaikichiCount}
              />            </div>
          )}

          <button onClick={() => setShowEndingScreen(!showEndingScreen)} className="w-full flex justify-between font-bold border-b border-[#00426D]/30 pb-2 text-[#00426D]">
            <span>🖼️ 終了画面</span><span>{showEndingScreen ? "−" : "＋"}</span>
          </button>
          {showEndingScreen && (
            <div className="space-y-1">
              <CounterInput label="鉄下駄(デフォルト)" value={tetsugetaCount} setValue={setTetsugetaCount} />
              <CounterInput label="メンバー(高設定示唆)" value={memberCount} setValue={setMemberCount} />
              <CounterInput label="水着(6濃厚🏆)" value={mizugiCount} setValue={setMizugiCount} />
            </div>
          )}
        </div>

        {/* 🏆 結果表示 */}
        {isReadyToDisplay && (
          <div className="mt-8 border-t pt-6">
            {closestSetting ? (
              <div className="bg-cyan-800 text-white rounded-lg p-4 text-center mb-6 shadow">
                <p className="text-sm opacity-90">判定で最も可能性が高いのは</p>
                <p className="text-3xl font-black mt-1">設定 {closestSetting.setting}</p>
              </div>
            ) : (
              <div className="bg-red-600 text-white rounded-lg p-4 text-center mb-6">演出矛盾があります</div>
            )}

            <div className="space-y-2">
              {finalProbability.map((item) => {
                const isClosest = item.setting === closestSetting.setting && Number(item.probability) > 0;
                return (
                  <div key={item.setting} className={`border rounded-xl p-3 flex justify-between items-center ${isClosest ? "bg-blue-50 border-blue-400 ring-2 ring-blue-100" : "bg-white"}`}>
                    <span className="font-bold">設定 {item.setting}</span>
                    <span className={`text-xl font-black ${isClosest ? "text-blue-600" : "text-neutral-500"}`}>{item.probability}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}