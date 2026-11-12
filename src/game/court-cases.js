// Incidents are sourced; charges, evidence summaries and severity are game adaptations.
// Never invent an incident for a character with no verified entry.
const anime=n=>`https://jujutsukaisen.jp/episodes/${String(n).padStart(2,'0')}.php`;
const timeline='https://jujutsukaisen.jp/shibuyaincidentnow/timetable.php';
const culling='https://jujutsukaisen.jp/shimetsukaiyu/';
const wiki=slug=>`https://jujutsu-kaisen.fandom.com/wiki/${slug}`;
const entry=(charge,evidence,severity,source,label,note='')=>({charge,evidence,severity,source,label,note});
export const courtCases={
 yuji:entry('未成年でのパチンコ店への入店','日車に提出：虎杖が景品交換所で換金している防犯カメラの写真。入店そのものを写した写真ではない。',1,wiki('Chapter_164'),'原作第164話（解説）','本編で実際に裁かれた件。渋谷で宿儺が起こした殺人を虎杖本人の犯行にはしません。'),
 yuta:entry('虎杖悠仁への刺傷','日車に提出：乙骨が虎杖の胸を刀で貫いた場面の記録。ただし、直後に反転術式で蘇生させ、虎杖を助ける意図があった。',2,culling,'公式・死滅回游の記録','蘇生と救出の事情も併記。これはゲーム上の起訴で、原作の有罪判決ではありません。'),
 gojo:entry('呪術総監部の上層部の殺害','日車に提出：宿儺との決戦前、五条が残る上層部を殺害した経緯の記録。',2,wiki('Jujutsu_Headquarters'),'総監部の経緯（原作解説）'),
 sukuna:entry('渋谷での大量殺人','日車に提出：渋谷の惨劇の実行者が虎杖ではなく、身体を支配していた宿儺だと示す証拠。',2,wiki('Deadly_Sentencing'),'誅伏賜死の裁判（原作解説）'),
 megumi:entry('中学時代の暴行','日車に提出：中学時代、伏黒が不良たちを殴り倒していた場面の記録。相手側のいじめ行為という事情もある。',1,wiki('Saitama_Urami_East_Junior_High'),'浦見東中学校・原作第56話ほか（解説）'),
 mahito:entry('人間の改造と殺害','日車に提出：渋谷で大量の改造人間を連れて参戦し、一般人を巻き込んだ記録。',2,anime(33),'公式・第33話'),
 hakari:entry('賭け試合の主催','日車に提出：秤が胴元として賭け試合を主催している会場の記録。',1,anime(52),'公式・第52話'),
 jogo:entry('一般人を盾にした渋谷駅での襲撃','日車に提出：一般人を盾にして五条と交戦し、被害を広げた記録。',2,anime(33),'公式・第33話'),
 naoya:entry('伏黒恵の暗殺計画と襲撃','日車に提出：禪院家当主の座を狙って伏黒の暗殺を企て、虎杖たちを襲った記録。',2,anime(48),'公式・第48話'),
 geto:entry('羂索による五条の封印への加担','日車に提出：夏油の身体を使う羂索らが獄門疆で五条を封印した記録。',2,timeline,'公式・渋谷事変の時系列','このキャラは「羂索」として扱います。夏油本人の行為とは区別します。'),
 ryu:entry('仙台結界での乙骨への攻撃','日車に提出：石流が乙骨・烏鷺と交戦した記録。死滅回游の戦闘という事情も含む。',1,culling,'公式・死滅回游の記録'),
 reggie:entry('伏黒を誘い込んで集団で襲撃','日車に提出：麗美に案内させた伏黒を、レジィたちが3対1で襲った記録。',2,anime(57),'公式・第57話'),
 higuruma:entry('裁判官と検察官の殺害','日車に提出：術式覚醒後に裁判官と検察官を殺したことについて、日車自身が語った記録。',2,wiki('Hiromi_Higuruma/Synopsis'),'日車の経緯（原作解説）'),
 kashimo:entry('パンダへの攻撃と重大な損傷','日車に提出：東京第2結界で鹿紫雲がパンダを攻撃し、身体と核に大きな損傷を与えた記録。',2,wiki('Panda_vs._Hajime_Kashimo'),'原作第184〜185話（解説）'),
 hanami:entry('一般人を盾にした渋谷駅での襲撃','日車に提出：漏瑚らと共に一般人を盾として五条と交戦した記録。',2,anime(33),'公式・第33話'),
 dagon:entry('渋谷駅での一般人の殺害','日車に提出：渋谷駅地下4階で大勢の一般人を捕食した記録。',2,timeline,'公式・渋谷事変の時系列'),
 uro:entry('仙台結界での乙骨への攻撃','日車に提出：烏鷺が乙骨・石流と交戦した記録。死滅回游の戦闘という事情も含む。',1,culling,'公式・死滅回游の記録'),
 uraume:entry('渋谷での呪術師たちへの襲撃','日車に提出：裏梅が氷凝呪法で呪術師たちを追い詰め、九十九の介入まで危機に陥れた記録。',2,timeline,'公式・渋谷事変の時系列'),
 todo:entry('伏黒恵への暴行','日車に提出：高専で伏黒にけんかを吹っかけ、殴りかかった記録。',1,anime(8),'公式・第8話'),
};
courtCases.meguna={...courtCases.sukuna,note:'被告は身体の持ち主の伏黒ではなく、宿儺本人です。'};
export function caseFor(id){return courtCases[id]||{charge:'起訴できる本編の罪状が未登録',evidence:'確認できる罪状・証拠がないため、このゲームでは処罰しません。',severity:0,source:null,label:null,note:id==='blood'?'赤血操術は術式名で、使い手の人物が未指定です。':'未登録は「原作で絶対に無罪」という意味ではありません。'};}
export const pleaProbabilities={deny:[.2,0,.8],silence:[.1,.5,.4],confess:[0,.6,.4]};
export const courtDistribution=(severity,plea)=>severity===0?[1,0,0]:(pleaProbabilities[plea]||[1,0,0]);
export function courtVerdict(severity,plea,roll=Math.random()){
 const probabilities=courtDistribution(severity,plea);let cumulative=0;
 for(let verdict=0;verdict<3;verdict++){cumulative+=probabilities[verdict];if(roll<cumulative)return verdict;}
 return probabilities[2]>0?2:probabilities[1]>0?1:0;
}
export const pleaChanceText=plea=>({deny:'無罪20％・有罪 没収0％・有罪 没収 死刑80％',silence:'無罪10％・有罪 没収50％・有罪 没収 死刑40％',confess:'無罪0％・有罪 没収60％・有罪 没収 死刑40％'})[plea];
export const verdictName=n=>n===0?'無罪':n===1?'有罪・没収':'有罪・没収・死刑';
export const courtRuleNote='罪状の元になった出来事は本編から採用。証拠文は場面の要約で、虎杖の写真以外の証拠資料はゲーム用の構成です。判決は返答ごとの確率で抽選。否認：無罪20％・没収0％・没収＋死刑80％。黙秘：無罪10％・没収50％・没収＋死刑40％。自白：無罪0％・没収60％・没収＋死刑40％。';
