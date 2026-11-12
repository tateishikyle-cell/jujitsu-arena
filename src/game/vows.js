// Source facts are separated from numerical Hand rules. All numbers below are game adaptations.
const wiki='https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow';
const detail='https://w.atwiki.jp/aniwotawiki/pages/57033.html';
const v=(id,name,owner,canon,game,owners=null,source=wiki)=>({id,name,owner,canon,game,owners,source,playable:true});
const ref=(id,name,owner,canon,reason,source=detail)=>({...v(id,name,owner,canon,reason,[],source),playable:false});
export const vows=[
v('reveal','術式の開示','七海ほか','手の内を明かし、術式を強化。','初手は開示だけで終了。以後、通常ダメージの攻撃＋1。'),
v('ritual','発動手順を省略しない','五条・歌姫','工程を尽くして出力を上げる。','消費がある攻撃の消費＋1、通常ダメージ＋2（消費0は据置）。全キャラ用の再現。',null,detail),
v('stationary','両足を動かさない簡易領域','三輪','足を固定して簡易領域を維持。','簡易領域1チャージ。使用の次ターンは回避技を使えない。全キャラ用の再現。'),
v('lastStrike','未来を懸けた一撃','三輪','以後刀を振らないと誓う。','最初の攻撃＋6。その後この試合の攻撃は全て使用不可。全キャラ用の再現。'),
v('overtime','時間外労働','七海','時間内の抑制と時間外の増強。','1〜5ターンの攻撃−1、6ターン目以降＋2。',['nanami']),
v('arm','左腕を捨てる','秤','腕を犠牲に全身を守る。','最初の通常ダメージを5軽減。その後、反転で治療するまで領域不可。即死は防げない。',['hakari']),
v('hardbody','変形を制限して硬化','真人','変形を制限し肉体を強化。','回復・人貯め不可。通常の被ダメージ−1。即死は防げない。',['mahito']),
v('blades','刃の変形時間を制限','真人','刃の制約で射程を確保。','消費がある攻撃の消費＋1、通常ダメージ＋2（消費0は据置）。',['mahito']),
v('compression','高速時の硬度を優先','直哉（呪霊）','高速形態に硬度を集中。','攻撃中は通常の被ダメージ−2。それ以外は＋1。呪霊形態の性質をこのキャラで再現。',['naoya']),
v('copyLimit','模倣の回数制限','乙骨','使用回数を縛って模倣。','模倣が1チャージになる代わりに、この試合1回だけ。',['yuta'],'https://jujutsu-kaisen.fandom.com/wiki/Copy'),
v('trueLove','命を懸けた純愛','乙骨（0）','里香へ命を差し出す誓い。','純愛砲＋5。ただし発射したターン末に自身も死亡。原作の解呪による結末とは異なるリスク再現。',['yuta'],'https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu/Synopsis'),
v('world','世界を断つ斬撃の初回省略','宿儺','初回を省略し以後の条件を追加。','世界を断つ斬撃は初回0、2回目以降5チャージ。ダメージは従来どおり。',['sukuna','meguna']),
v('open','閉じない領域','宿儺・羂索','逃げ道を与え効果範囲を拡張。','領域の消費−1。ただし残り2ターンに短縮、相手の回避技でも領域が消える。',['sukuna','meguna','geto'],detail),
v('narrow','必中範囲の縮小・条件変更','宿儺','範囲と必中の条件を交換。','領域の消費−2。ただし残り1ターンに短縮。既存の領域防御は有効。',['sukuna','meguna']),
v('kamino','竈の対象制限','宿儺','領域外での多対象使用を制限。','この1対1ゲームでは竈を領域中だけに限定する代わりに＋3ダメージ。原作より強い制限への換算。',['sukuna','meguna']),
v('swaps','不義遊戯・改の回数制限','東堂','回数を絞り対象と範囲を広げる。','ブギウギ0チャージ。ただし使用後の次ターンは使えない。対象拡張を回避の省エネに換算。',['todo']),
v('boundary','魂の境界に対象を限定','虎杖','受肉した魂の境界を狙う。','「魂の境界への解」を追加。2チャージ、HPダメージなし。受肉キャラだけ呪力−3・行動不能1T。',['yuji'],'https://jujutsu-kaisen.fandom.com/wiki/Chapter_263'),
ref('bird','神風（バードストライク）','冥冥','烏の命を代価に強化。','冥冥と烏が未実装のため選択不可。',wiki),
ref('enchain','契闊','虎杖・宿儺','蘇生と引き換えの一時的な主導権。','両者の契約と身体交代が必要。戦闘バフにはしません。',wiki),
ref('spy','内通と身体の治療','メカ丸・真人・羂索','情報提供と身体治療の契約。','当事者と物語の契約が必要。',wiki),
ref('permission','姉の許可','憂憂・冥冥','許可を受けて呪術を使う。','当事者が未実装。',wiki),
ref('execution','虎杖の処刑執行','乙骨・総監部','虎杖の殺害を約束。','総監部との契約。通常対戦で自動契約させません。',wiki),
ref('report','治療と処刑報告','乙骨・直哉','治療の見返りに報告。','物語の契約・報告行為が必要。'),
ref('oldRika','里香の魂の抑留','乙骨（0）','過去の里香と乙骨の関係。','現在のリカと同一扱いにしない参考項目。'),
ref('cursedObject','特級呪物の不壊性','特級呪物','無害性と破壊耐性の関係。','受肉前の呪物の性質。対戦中のキャラ用には選択不可。'),
ref('stitches','額の縫い目を残す','羂索','傷を残す縛り。','得られる効果が不明なので数値化しません。'),
ref('99seconds','99秒の領域再展開','宿儺','即席の縛りで領域を再展開。','縛りの全条件が不明なので選択不可。',wiki),
ref('culling','死滅回游を終える難題','羂索','ゲーム成立に課した難題。','対戦前の個人強化として扱えない物語・結界の条件。'),
ref('incarnation','過去の術師との契約','羂索・過去の術師','後世への受肉に関わる契約。','受肉・契約の仕組みが必要。',wiki),
ref('gojoCurtain','五条のみを拒む帳','羂索側の結界','対象を限定して排除。','帳と移動範囲が未実装。'),
ref('outsideCurtain','帳の外へ基を置く','羂索側の結界','発見のリスクを負う結界。','帳と基の探索が未実装。'),
ref('nobara','呪物を壊さず共鳴りを通す','釘崎','物理破壊を対象から外す。','釘崎・共鳴り・呪物が未実装。'),
ref('mai','命を懸けた呪具構築','真依','命を代価に呪具を構築。','真依と呪具の受け渡しが未実装。'),
ref('yorozu','命を懸けた神武解の構築','万','命を代価に神武解を構築。','万と呪具の受け渡しが未実装。'),
ref('school','シン・陰流の伝授制限','シン・陰流','技術伝授を制限する契約。','師弟関係と伝授の制度。個人戦の能力ではありません。','https://jujutsu-kaisen.fandom.com/wiki/Chapter_269'),
ref('maki','真希の天与呪縛','真希','生まれつき課された身体の条件。','先天的な性質。自由に選ぶ自己契約ではありません。'),
ref('toji','甚爾の天与呪縛','甚爾','呪力を持たない身体の条件。','先天的な性質。キャラ自体が未実装。'),
ref('mech','メカ丸の天与呪縛','メカ丸','身体の制約と広い術式範囲。','先天的な性質。キャラ自体が未実装。'),
ref('higuruma','非暴力・ルール説明の領域','日車','領域のルールを相手に強制。','裁判として既に実装済み。二重強化はしません。'),
ref('flight','頭部と身体の硬度配分','羽場・羽生','頭部と他部位の強度が異なる。','キャラと飛行が未実装。'),
ref('purpleUncertain','無制限の虚式','五条','自らも巻き込む虚式。','縛りと明言されていないため参考のみ。'),
ref('chantUncertain','呪詞による出力回復','五条ほか','詠唱による出力補完。','独立した縛りかは明確でない参考項目。'),
ref('protectionUncertain','羂索と宿儺の護衛契約','羂索・宿儺','護衛に関する契約の推測。','内容確定でないため参考のみ。'),
ref('marriage','勝利後の婚約','万・宿儺','勝利条件付きの約束。','未成立の約束。対戦バフにはしません。'),
];
export const vowById=id=>vows.find(v=>v.id===id);
export const canChooseVow=(id,char)=>id==='none'||!!vows.find(v=>v.id===id&&v.playable&&(!v.owners||v.owners.includes(char)));
export function attachVow(p,id='none'){if(!canChooseVow(id,p.id))throw new Error('このキャラでは選べない縛りです');if(id!=='none'){p.vow=id;p.vowUsed=false;p.vowCount=0;p.vowLock=0;p.vowArm=false;}return p;}
export const vowDuration=p=>p.vow==='open'?2:p.vow==='narrow'?1:3;
export function vowPrice(p,a,copiedType=null){if(!p.vow)return a;const base=a.vowBaseCost??a.c;let c=base;
if(['ritual','blades'].includes(p.vow)&&(a.type==='attack'||(a.type==='copy'&&copiedType==='attack'))&&!a.execution&&base>0)c=base+1;
if(p.vow==='world'&&a.id==='world')c=p.vowCount?5:0;
if(p.vow==='copyLimit'&&a.type==='copy')c=1;
if(p.vow==='stationary'&&a.type==='simple')c=1;
if(p.vow==='swaps'&&a.id==='boogie')c=0;
if(p.vow==='open'&&a.type==='domain')c=Math.max(0,base-1);
if(p.vow==='narrow'&&a.type==='domain')c=Math.max(0,base-2);
const disabled=!!a.disabled||(p.vow==='lastStrike'&&p.vowUsed&&a.type==='attack')||(p.vow==='copyLimit'&&p.vowUsed&&a.type==='copy')||(p.vow==='hardbody'&&['reverse','heal','soul'].includes(a.type))||(p.vow==='stationary'&&p.vowLock>0&&a.type==='dodge')||(p.vow==='swaps'&&p.vowLock>0&&a.id==='boogie')||(p.vow==='arm'&&p.vowArm&&a.type==='domain')||(p.vow==='kamino'&&a.id==='fire'&&!p.domain);
return {...a,c,vowBaseCost:base,disabled};}
export function vowAttackBonus(s,p,a){if(a.execution||!(a.d>0)||a.d>=99)return 0;switch(p.vow){case'reveal':return p.vowUsed?1:0;case'ritual':case'blades':return 2;case'overtime':return s.turn<=5?-1:2;case'lastStrike':return p.vowUsed?0:6;case'trueLove':return a.id==='love'?5:0;case'kamino':return a.id==='fire'?3:0;default:return 0;}}
