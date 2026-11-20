const W=900,H=500;
const config={type:Phaser.AUTO,parent:'game',width:W,height:H,backgroundColor:'#78c9ff',physics:{default:'arcade',arcade:{gravity:{y:900},debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:{preload,create,update}};
new Phaser.Game(config);
let player,keys,platforms,enemy,powerup,score=0,scoreText,transformed=false, cursors;
function preload(){
 this.load.image('officer','assets/officer.png');
 this.load.image('troll','assets/trollface.webp');
 this.load.image('alien','assets/alien.jpg');
 this.load.image('flag','assets/flag.webp');
}
function create(){
 const s=this;
 // scenery and ground
 s.add.rectangle(450,485,900,30,0x684020);
 s.add.rectangle(450,465,900,18,0x39b82b);
 platforms=s.physics.add.staticGroup();
 [[230,365,170,20],[470,300,170,20],[700,385,150,20]].forEach(a=>{let p=platforms.create(a[0],a[1],'');p.setVisible(false);p.body.setSize(a[2],a[3]);p.body.updateFromGameObject();s.add.rectangle(a[0],a[1],a[2],a[3],0x985522).setStrokeStyle(3,0x38200f);});
 player=s.physics.add.sprite(90,390,'officer').setScale(.30).setCollideWorldBounds(true);
 player.body.setSize(130,220).setOffset(35,25);
 s.physics.add.collider(player,platforms);
 s.physics.add.staticGroup(); s.physics.add.collider(player,s.physics.add.staticGroup());
 enemy=s.physics.add.sprite(650,410,'troll').setScale(.24).setImmovable(true);enemy.body.allowGravity=false;
 powerup=s.physics.add.staticImage(470,245,'alien').setScale(.13);
 s.physics.add.overlap(player,powerup,()=>{powerup.destroy();transformed=true;score+=100;scoreText.setText('SCORE: '+score+'  |  ALIEN POWER: ON');},null,s);
 s.physics.add.overlap(player,enemy,()=>{score=Math.max(0,score-10);scoreText.setText('SCORE: '+score+'  |  Avoid the troll!');player.setTint(0xffaaaa);s.time.delayedCall(250,()=>player.clearTint());},null,s);
 scoreText=s.add.text(15,12,'SCORE: 0  |  Find the alien!',{fontSize:'22px',color:'#101525',fontStyle:'bold'}).setScrollFactor(0);
 cursors=s.input.keyboard.createCursorKeys();keys=s.input.keyboard.addKeys('A,D,W');
 // simple movement touch buttons
 bindButton('left',()=>player.setVelocityX(-230),()=>{if(!cursors.left.isDown&&!keys.A.isDown)player.setVelocityX(0)});
 bindButton('right',()=>player.setVelocityX(230),()=>{if(!cursors.right.isDown&&!keys.D.isDown)player.setVelocityX(0)});
 bindButton('jump',()=>{if(player.body.blocked.down||player.body.touching.down)player.setVelocityY(-480)},()=>{});
 s.add.text(15,45,'Collect the alien. Avoid the trollface.',{fontSize:'16px',color:'#101525'});
}
function bindButton(id,down,up){const b=document.getElementById(id);b.addEventListener('pointerdown',e=>{e.preventDefault();down()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,e=>{e.preventDefault();up()}));}
function update(){
 const left=cursors.left.isDown||keys.A.isDown,right=cursors.right.isDown||keys.D.isDown;
 if(left)player.setVelocityX(-230);else if(right)player.setVelocityX(230);else if(!document.querySelector('.touch button:active'))player.setVelocityX(0);
 if((cursors.up.isDown||cursors.space.isDown||keys.W.isDown)&&(player.body.blocked.down||player.body.touching.down))player.setVelocityY(-480);
 // Flag-power visual: keep the original officer art; show flag as a badge beside him.
 if(transformed&&!this.flagBadge){this.flagBadge=this.add.image( player.x+35,player.y-65,'flag').setDisplaySize(70,46);this.flagBadge.setDepth(5);}
 if(this.flagBadge){this.flagBadge.setPosition(player.x+38,player.y-65);}
}