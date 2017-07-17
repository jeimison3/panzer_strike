function Inimigo (context, imagem, imgExplosao,panzerUtil) {
  this.context = context;
  this.imagem = imagem;
  this.panzer=panzerUtil;
  this.direcaoQuant=18;
  this.probabilidade_seguirPlayer=0.72; //80% = fácil. 69% = normal. 72% = difícil
  this.dificuldadeBot=0.40; //Probabilidade do robô fugir da "linha de fogo". Use 40% (fácil), 70%(intermediário) ou 100%(difícil).
  this.x = 0;
  this.y = 0;
  this.velocidade = 0;
  
  this.direcaoMov=Math.random()>0.5?1:2;
  this.isInvertendoRoboDirecao=false;
  this.direcaoCont=0;
  
  this.imgExplosao = imgExplosao;

  this.spritesheet = new Spritesheet(context, imagem, 4, 6);
  this.spritesheet.linha = 1;
  this.spritesheet.coluna = 3;
  this.spritesheet.intervalo = 3000;

}

Inimigo.prototype = {
  atualizar: function () {
    //this.x += -this.velocidade * this.animacao.decorrido / 2000;
	var movimento = this.velocidade * this.animacao.decorrido / 4000;
	if(this.direcaoCont<=this.direcaoQuant){
		
		var inimXMaiorPanzerX=this.x>this.panzer.x;
		var inimYMaiorPanzerY=this.y>this.panzer.y;
		if(this.isInvertendoRoboDirecao){
			inimXMaiorPanzerX=!inimXMaiorPanzerX;inimYMaiorPanzerY=!inimYMaiorPanzerY;
		}
		
		if(this.direcaoMov==1){ //Esquerda <-> Direita
	
			
		if(inimXMaiorPanzerX)
		this.x += -this.velocidade * this.animacao.decorrido / 4000;
		else this.x += this.velocidade * this.animacao.decorrido / 4000;
		}
		
		else if(this.direcaoMov==2){ //Cima <-> Baixo
			/*if((this.dificuldadeBot>=Math.random()) && (!this.isInvertendoRoboDirecao)){//Desviar se
				inimYMaiorPanzerY=!((Math.abs(this.x-movimento-this.panzer.x)<=this.panzer.raioTiro)
				&&(Math.abs(this.x+movimento-this.panzer.x)<=this.panzer.raioTiro));
			}*/
		
		
		//	if((this.dificuldadeBot<=Math.random()) && (!this.isInvertendoRoboDirecao))//Desviar
		//		inimYMaiorPanzerY=!inimYMaiorPanzerY;
		
		if(inimYMaiorPanzerY)
		this.y += -this.velocidade * this.animacao.decorrido / 4000;
		else this.y += this.velocidade * this.animacao.decorrido / 4000;
		}
		
		this.direcaoCont++;
	}else {
		this.direcaoCont=0;
		this.direcaoMov=(Math.random()>0.5? 1:2);
		//this.isInvertendoRoboDirecao=!(this.probabilidade_seguirPlayer>=Math.random()); //[ALEATÓRIO]
		
		if(this.dificuldadeBot>=Math.random()){//Desviar
		if(this.direcaoMov==1) this.isInvertendoRoboDirecao=((Math.abs(this.x-(movimento*this.direcaoQuant)-this.panzer.x)<=this.panzer.raioTiro)||(Math.abs(this.x+(movimento*this.direcaoQuant)-this.panzer.x)<=this.panzer.raioTiro*this.direcaoQuant));
		else if(this.direcaoMov==2) this.isInvertendoRoboDirecao=((Math.abs(this.y-(movimento*this.direcaoQuant)-this.panzer.y)<=this.panzer.raioTiro)||(Math.abs(this.y+(movimento*this.direcaoQuant)-this.panzer.y)<=this.panzer.raioTiro*this.direcaoQuant));
		
		}else this.isInvertendoRoboDirecao=false;
		
		}
	
    //console.log("this.context.canvas.width "+this.context.canvas.width);
    //console.log("this.x: "+this.x);
	
    if (this.x <= 0) {
      this.animacao.excluirSprite(this);
      this.colisor.excluirSprite(this);
    }
    
  },
  desenhar: function () {
    // Desenhar imagem estática
    // var ctx = this.context;
    // var img = this.imagem;
    this.spritesheet.desenhar(this.x, this.y);
    this.spritesheet.proximoQuadro();
  },
  retangulosColisao: function() {
    // Estes valores vão sendo ajustados aos poucos
    var rets = 
    [ 
      {x: this.x+8, y: this.y+3, largura: 53, altura: 45},
      {x: this.x+1, y: this.y+10, largura: 9, altura: 15}
    ];
   
	if(DEBUG_MODE){//Se modo depuração está ativo.
    // Desenhando os retângulos para visualização
     var ctx = this.context;   
     for (var i in rets) {
       ctx.save();
       ctx.strokeStyle = 'yellow';
       ctx.strokeRect(rets[i].x, rets[i].y, rets[i].largura, rets[i].altura);
       ctx.restore();
     }
	}
    return rets;
  },
  colidiuCom: function(outro) {
    if (outro instanceof Tiro) {
      this.animacao.excluirSprite(this);
      this.colisor.excluirSprite(this);
      this.animacao.excluirSprite(outro);
      this.colisor.excluirSprite(outro);
       
      var explosao = new Explosao(this.context, this.imgExplosao, 
                                   this.x, this.y);
      this.animacao.novoSprite(explosao);
    }
  }
}