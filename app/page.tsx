"use client";

import { useState } from "react";
const settingsData = [
  { setting: 1, rate: 121.1 },
  { setting: 2, rate: 114.4 },
  { setting: 3, rate: 112.8 },
  { setting: 4, rate: 106.2 },
  { setting: 5, rate: 104.2 },
  { setting: 6, rate: 99.1 },
];
const stSettingsData = [
  { setting: 1, rate: 52 },
  { setting: 2, rate: 54 },
  { setting: 3, rate: 56 },
  { setting: 4, rate: 60 },
  { setting: 5, rate: 63 },
  { setting: 6, rate: 66 },
];

export default function Home() {

  const [games, setGames] = useState("");
  const [bells, setBells] = useState("");
  const [episodeBonus, setEpisodeBonus] = useState("");
  const [surugaBonus, setSurugaBonus] = useState("");
  const [surugaST, setSurugaST] = useState("");
  const [tetsugetaCount, setTetsugetaCount] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [mizugiCount, setMizugiCount] = useState("");

  const bellRate =
    Number(games) > 0 && Number(bells) > 0
      ? (Number(games) / Number(bells)).toFixed(1)
      : null;
  const totalBonus =
    Number(episodeBonus) + Number(surugaBonus);

  const totalST =
    Number(episodeBonus) + Number(surugaST);

  const stRate =
    totalBonus > 0
      ? ((totalST / totalBonus) * 100).toFixed(1)
      : null;

  const comparison = bellRate
    ? settingsData.map((item) => {
      const difference = Math.abs(
        Number(bellRate) - item.rate
      );

      const score = 1 / (difference + 1);

      return {
        ...item,
        difference,
        score,
      };
    })
    : [];

  const stComparison = stRate
    ? stSettingsData.map((item) => {
      const difference = Math.abs(
        Number(stRate) - item.rate
      );

      const score = 1 / (difference + 1);

      return {
        ...item,
        difference,
        score,
      };
    })
    : [];

  const combinedData = settingsData.map((item) => {

    const bellItem = comparison.find(
      (c) => c.setting === item.setting
    );

    const stItem = stComparison.find(
      (s) => s.setting === item.setting
    );

    let totalScore =
      (bellItem?.score || 0) +
      (stItem?.score || 0);

    // 甲鉄城メンバー加点
    if (item.setting >= 4) {
      totalScore += Number(memberCount) * 2;
    }

    // 水着加点
    if (item.setting === 6) {
      totalScore += Number(mizugiCount) * 999;
    }

    return {
      setting: item.setting,
      rate: item.rate,
      totalScore,
    };
  });
  const combinedTotal = combinedData.reduce(
    (sum, item) => sum + item.totalScore,
    0
  );

  const finalProbability = combinedData.map(
    (item) => ({
      ...item,
      probability: (
        (item.totalScore / combinedTotal) *
        100
      ).toFixed(1),
    })
  );


  const closestSetting =
    finalProbability.length > 0
      ? finalProbability.reduce((prev, current) =>
        Number(prev.probability) >
          Number(current.probability)
          ? prev
          : current
      )
      : null;
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
          スマスロ カバネリ 設定判別
        </h1>

        <div className="mb-4">
          <label className="block mb-2 font-bold">
            総ゲーム数
          </label>

          <input
            type="number"
            value={games}
            onChange={(e) => setGames(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="例：3000"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold">
            下段ベル回数
          </label>

          <input
            type="number"
            value={bells}
            onChange={(e) => setBells(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="例：28"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">
            エピソードボーナス回数
          </label>

          <input
            type="number"
            value={episodeBonus}
            onChange={(e) =>
              setEpisodeBonus(e.target.value)
            }
            className="w-full border rounded-lg p-2"
            placeholder="例：3"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-bold">
            駿城ボーナス回数
          </label>

          <input
            type="number"
            value={surugaBonus}
            onChange={(e) =>
              setSurugaBonus(e.target.value)
            }
            className="w-full border rounded-lg p-2"
            placeholder="例：7"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-bold">
            駿城ボーナス成功回数
          </label>

          <input
            type="number"
            value={surugaST}
            onChange={(e) =>
              setSurugaST(e.target.value)
            }
            className="w-full border rounded-lg p-2"
            placeholder="例：4"
          />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">
            終了画面
          </h2>

          <div className="mb-4">
            <label className="block mb-2 font-bold">
              鉄下駄
            </label>

            <input
              type="number"
              value={tetsugetaCount}
              onChange={(e) =>
                setTetsugetaCount(e.target.value)
              }
              className="w-full border rounded-lg p-2"
              placeholder="例：10"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold">
              甲鉄城メンバー
            </label>

            <input
              type="number"
              value={memberCount}
              onChange={(e) =>
                setMemberCount(e.target.value)
              }
              className="w-full border rounded-lg p-2"
              placeholder="例：3"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">
              水着
            </label>

            <input
              type="number"
              value={mizugiCount}
              onChange={(e) =>
                setMizugiCount(e.target.value)
              }
              className="w-full border rounded-lg p-2"
              placeholder="例：1"
            />
          </div>
        </div>
        <button className="w-full bg-blue-500 text-white rounded-lg p-3 font-bold mb-6">
          判別する
        </button>

        {bellRate && (
          <div className="bg-gray-100 rounded-lg p-4">
            {closestSetting && (
              <p className="text-xl font-bold text-blue-600 mt-2">
                現在もっとも近いのは設定{closestSetting.setting}
              </p>
            )}
            <p className="text-lg font-bold">
              下段ベル実測確率：1/{bellRate}
            </p>
            {stRate && (
              <p className="text-lg font-bold mt-2">
                ST突入率：{stRate}%
              </p>
            )}
          </div>
        )}
        {bellRate && (
          <div className="mt-4">
            <h2 className="font-bold mb-2">
              設定別比較
            </h2>

            <div className="space-y-2">
              {finalProbability.map((item) => (
                <div
                  key={item.setting}
                  className={`border rounded-lg p-3 ${item.setting === closestSetting?.setting
                    ? "bg-blue-100 border-blue-500"
                    : ""
                    }`}
                >
                  <p>
                    設定{item.setting}
                  </p>

                  <p>
                    設定別下段ベル確率：1/{item.rate}
                  </p>

                  <p>
                    設定期待度：{item.probability}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}