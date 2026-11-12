// The raid mode replaces the cancelled multi-phase boss prototype.
export const bosses=[
 {id:'sukuna',name:'完全体宿儺',hp:20,mark:'斬',note:'伏魔御厨子3チャージ・世界を断つ斬撃2チャージ。領域と竈は3人全員が対象。'},
 {id:'gojo',name:'最終決戦五条悟',hp:40,mark:'無',note:'200％紫は4チャージ・15ダメージ・単体。無限は0チャージ。AIだけ連発を控えて判断。'}
];
export const bossById=id=>bosses.find(b=>b.id===id);
