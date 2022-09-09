!function(){"use strict";var t={984:function(){Array.prototype.findIndex||(Array.prototype.findIndex=function(t){if(null==this)throw new TypeError("Array.prototype.findIndex called on null or undefined");if("function"!=typeof t)throw new TypeError("predicate must be a function");for(var e,a=Object(this),s=a.length>>>0,i=arguments[1],r=0;r<s;r++)if(e=a[r],t.call(i,e,r,a))return r;return-1})}},e={};function a(s){var i=e[s];if(void 0!==i)return i.exports;var r=e[s]={exports:{}};return t[s](r,r.exports,a),r.exports}!function(){var t;a(984),function(t){t[t.null=0]="null",t[t.empty=1]="empty",t[t.wall=2]="wall",t[t.player=3]="player",t[t.enemy=4]="enemy",t[t.sword=5]="sword",t[t.health=6]="health"}(t||(t={}));var e=function(t,e){return Math.round(t-.5+Math.random()*(e-t+1))},s=function(t,e,a){if(a||2===arguments.length)for(var s,i=0,r=e.length;i<r;i++)!s&&i in e||(s||(s=Array.prototype.slice.call(e,0,i)),s[i]=e[i]);return t.concat(s||Array.prototype.slice.call(e))},i={area:[],diffArea:[],empty:[],player:{position:{x:0,y:0},healthpoint:50,power:20},enemies:{}},r=new(function(){function a(e,a){this.container=e,this.resources=a,this.state=i,this.width=32,this.height=20,this.isEnd=!1,this.state.area=new Array(this.height);for(var s=0;s<this.height;s++){this.state.area[s]=new Array(this.width);for(var r=0;r<this.width;r++)this.state.area[s][r]={type:t.null}}}return a.prototype.init=function(){var e=this;this.isEnd=!1,this.state.empty=[],this.fill(t.wall),this.generateRooms(),this.generateWays(),this.playerSpawn(),this.healthpointSpawn(10),this.swordSpawn(2),this.enemySpawn(10),this.worldInterval=window.setInterval((function(){e.worldNext()}),500)},a.prototype.exit=function(){window.clearInterval(this.worldInterval)},a.prototype.fill=function(t){for(var e=0;e<this.height;e++)for(var a=0;a<this.width;a++)this.state.area[e][a].type=t,this.state.diffArea.push({x:a,y:e})},a.prototype.playerInfo=function(){return this.state.player},a.prototype.playerSpawn=function(){var a=e(0,this.state.empty.length-1),i=this.state.empty[a],r=i[0],h=i[1];this.state.player.position={x:h,y:r},this.state.area[r][h].type=t.player,this.state.area[r][h].health=this.state.player.healthpoint,this.state.empty=s(s([],this.state.empty.slice(0,a),!0),this.state.empty.slice(a+1),!0),this.state.diffArea.push({x:h,y:r})},a.prototype.playerMove=function(e){if(0!==this.state.player.healthpoint){var a=this.state.player.position,s=a.x,i=a.y,r=s,h=i;"left"===e&&(r-=1),"right"===e&&(r+=1),"up"===e&&(h-=1),"down"===e&&(h+=1),r<0&&(r=this.width-1),r>this.width-1&&(r=0),h<0&&(h=this.height-1),h>this.height-1&&(h=0),this.state.area[h][r].type!==t.wall&&this.state.area[h][r].type!==t.enemy&&(this.state.area[h][r].type===t.health&&(this.state.player.healthpoint+=15,this.state.player.healthpoint>100&&(this.state.player.healthpoint=100)),this.state.area[h][r].type===t.sword&&(this.state.player.power+=30),this.state.area[h][r].type=t.player,this.state.area[h][r].health=this.state.player.healthpoint,this.state.area[i][s].type=t.empty,this.state.area[i][s].health=void 0,this.state.player.position={x:r,y:h},this.state.empty=this.state.empty.filter((function(t){return t[1]!==r&&t[0]!==h})),this.state.empty.push([i,s]),this.state.diffArea.push({x:s,y:i}),this.state.diffArea.push({x:r,y:h}))}},a.prototype.playerKick=function(){var e=this;if(0!==this.state.player.healthpoint){var a=this.state.player.position,s=a.x,i=a.y;[this.state.area[i-1]&&this.state.area[i-1][s],this.state.area[i+1]&&this.state.area[i+1][s],this.state.area[i]&&this.state.area[i][s-1],this.state.area[i]&&this.state.area[i][s+1],this.state.area[i-1]&&this.state.area[i-1][s-1],this.state.area[i-1]&&this.state.area[i-1][s+1],this.state.area[i+1]&&this.state.area[i+1][s-1],this.state.area[i+1]&&this.state.area[i+1][s+1]].forEach((function(a){if(a.type===t.enemy){a.health-=e.state.player.power,e.state.enemies[a.id].healthpoint=a.health;var s=e.state.enemies[a.id].position,i=s.x,r=s.y;a.health<=0&&(e.state.enemies[a.id].healthpoint=0,e.state.area[r][i].type=t.empty,e.state.empty.push([r,i]),e.state.area[r][i].id=void 0,e.state.area[r][i].health=void 0,delete e.state.enemies[a.id]),e.state.diffArea.push({x:i,y:r})}}))}},a.prototype.healthpointSpawn=function(a){for(var i=0;i<a;i++){var r=e(0,this.state.empty.length-1),h=this.state.empty[r],n=h[0],p=h[1];this.state.area[n][p].type=t.health,this.state.empty=s(s([],this.state.empty.slice(0,r),!0),this.state.empty.slice(r+1),!0),this.state.diffArea.push({x:p,y:n})}},a.prototype.swordSpawn=function(a){for(var i=0;i<a;i++){var r=e(0,this.state.empty.length-1),h=this.state.empty[r],n=h[0],p=h[1];this.state.area[n][p].type=t.sword,this.state.empty=s(s([],this.state.empty.slice(0,r),!0),this.state.empty.slice(r+1),!0),this.state.diffArea.push({x:p,y:n})}},a.prototype.enemySpawn=function(a){for(var i=0;i<a;i++){var r=e(0,this.state.empty.length-1),h=this.state.empty[r],n=h[0],p=h[1];this.state.area[n][p].type=t.enemy,this.state.enemies[i]={healthpoint:100,position:{x:p,y:n}},this.state.empty=s(s([],this.state.empty.slice(0,r),!0),this.state.empty.slice(r+1),!0),this.state.diffArea.push({x:p,y:n})}},a.prototype.generateRooms=function(){for(var a=0;a<10;){for(var s=e(3,8),i=e(3,8),r=e(1,this.width-1-s),h=e(1,this.height-1-i),n=h;n<h+i;n++)for(var p=r;p<r+s;p++)this.state.area[n][p].type=t.empty,this.state.empty.push([n,p]),this.state.diffArea.push({x:p,y:n});a++}},a.prototype.generateWays=function(){for(var a=e(3,5),s=0,i=0;i<a;i++){s+=5===a?0===i?e(1,2):e(3,4):0===i?e(2,3):e(4,5);for(var r=function(e){if(h.state.area[s][e].type=t.empty,-1!==h.state.empty.findIndex((function(t){return t[0]===s&&t[1]===e})))return"continue";h.state.empty.push([s,e]),h.state.diffArea.push({x:e,y:s})},h=this,n=0;n<this.width;n++)r(n)}var p=e(3,5),o=0;for(i=0;i<p;i++){3===p&&(o+=e(6,8)),4===p&&(o+=e(5,7)),5===p&&(o+=e(4,6));var l=function(e){if(y.state.area[e][o].type=t.empty,-1!==y.state.empty.findIndex((function(t){return t[0]===e&&t[1]===o})))return"continue";y.state.empty.push([e,o]),y.state.diffArea.push({x:o,y:e})},y=this;for(n=0;n<this.height;n++)l(n)}},a.prototype.worldNext=function(){var a=this;Object.keys(this.state.enemies).forEach((function(s){var i,r,h,n,p=a.state.enemies[s];if(0!==p.healthpoint){var o=p.position,l=o.x,y=o.y,d=[],f=a.state.area[y-1]&&(null===(i=a.state.area[y-1][l])||void 0===i?void 0:i.type),c=a.state.area[y+1]&&(null===(r=a.state.area[y+1][l])||void 0===r?void 0:r.type),u=a.state.area[y]&&(null===(h=a.state.area[y][l-1])||void 0===h?void 0:h.type),m=a.state.area[y]&&(null===(n=a.state.area[y][l+1])||void 0===n?void 0:n.type);if(f===t.player||c===t.player||u===t.player||m===t.player){a.state.player.healthpoint-=20;var v=a.state.player.position,w=v.x,x=v.y;return a.state.player.healthpoint<=0&&(a.state.player.healthpoint=0,a.state.area[x][w].type=t.empty),a.state.area[x][w].health=a.state.player.healthpoint,void a.state.diffArea.push({x:w,y:x})}if(f===t.empty&&d.push("up"),c===t.empty&&d.push("down"),u===t.empty&&d.push("left"),m===t.empty&&d.push("right"),0!==d.length){var g=d[e(0,d.length-1)],A=l,k=y;"up"===g&&(k-=1),"down"===g&&(k+=1),"left"===g&&(A-=1),"right"===g&&(A+=1),a.state.area[k][A]={type:t.enemy,health:p.healthpoint,id:+s},a.state.area[y][l]={type:t.empty,health:void 0,id:void 0},a.state.enemies[s].position={x:A,y:k},a.state.diffArea.push({x:l,y:y}),a.state.diffArea.push({x:A,y:k})}}})),0!==this.state.player.healthpoint&&0!==Object.keys(this.state.enemies).length||(this.isEnd=!0)},a.prototype.render=function(){var e=this;if(0!==this.container.children.length)this.state.diffArea.forEach((function(a){var s,i=a.x,r=a.y,h=e.state.area[r][i],n=h.type,p=h.health,o=e.container.children[r].children[i];o.className="cell "+e.getClassName(n),n===t.enemy||n===t.player?void 0===o.children[0]?((s=document.createElement("health")).className="health",s.style.width=p+"%",o.appendChild(s)):(s=o.children[0]).style.width=p+"%":void 0!==o.children[0]&&o.children[0].remove()})),this.state.diffArea=[];else for(var a=0;a<this.height;a++){var s=document.createElement("div");s.className="line cl";for(var i=0;i<this.width;i++){var r=document.createElement("div");if(r.className="cell "+this.getClassName(this.state.area[a][i].type),this.state.area[a][i].type===t.player||this.state.area[a][i].type===t.enemy){var h=document.createElement("health");h.className="health",h.style.width=this.state.area[a][i].health+"%",r.appendChild(h)}s.appendChild(r)}this.container.appendChild(s)}},a.prototype.getClassName=function(e){var a=t[e];return this.resources[a].className},a}())(document.getElementsByClassName("field")[0],{empty:{className:"tile"},wall:{className:"tileW"},player:{className:"tileP"},enemy:{className:"tileE"},sword:{className:"tileSW"},health:{className:"tileHP"}});r.init(),setInterval((function(){var t=r.playerInfo(),e=t.healthpoint,a=t.power;document.getElementById("hp").innerHTML=""+e,document.getElementById("power").innerHTML=""+a,r.render()}),1e3/60);var h=!1;window.addEventListener("keydown",(function(t){h||("Space"!==t.code&&"Spacebar"!==t.key||r.playerKick(),"KeyW"!==t.code&&"w"!=t.key&&"ц"!==t.key&&"ArrowUp"!==t.code&&"Up"!==t.key||r.playerMove("up"),"KeyS"!==t.code&&"s"!=t.key&&"ы"!==t.key&&"ArrowDown"!==t.code&&"Down"!==t.key||r.playerMove("down"),"KeyA"!==t.code&&"a"!=t.key&&"ф"!==t.key&&"ArrowLeft"!==t.code&&"Left"!==t.key||r.playerMove("left"),"KeyD"!==t.code&&"d"!=t.key&&"в"!==t.key&&"ArrowRight"!==t.code&&"Right"!==t.key||r.playerMove("right"),h=!0,setTimeout((function(){return h=!1}),1e3/60))}))}()}();