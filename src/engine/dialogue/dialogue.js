/*
 * File: dialogue.js
 *
 * Define dialogue system
 * 
 */
"use strict";
import DialogueUI from "./dialogue_ui.js";
import DialogueText from "./dialogue_text.js";
import engine from "../index.js";
import { isButtonPressed } from "../input.js";

//Define a const parent node according to the first 'title' element
const buttonParentNode = document.querySelector('b').parentNode;

class Dialogue {
    constructor(largeBg, avatar, textBg, nameText, dialogueText) {
        //this.mRenderComponent = renderable;
        this.mVisible = false;

        this.mDialogueUI = null;
        this.mDialogueText = null;

        this.kLargeBg = largeBg;
        this.kAvatar = avatar;
        this.kTextBg = textBg;
        this.kNameBg = textBg;
        this.kDialogueText = dialogueText;
        this.kNameText = nameText;

        //Player's attribute
        this.kHealth = "Health:";
        this.kQi = "Qi:";
        this.kAttack = "Attack:";
        this.kDefend = "Defend:";  

        this.kHealthValue = 10;
        this.kQiValue = 1;
        this.kAttackValue = 1;
        this.kDefendValue = 1;   

        //Add attribute 1
        this.kHealthAdd1 = 0;
        this.kQiAdd1 = 0;
        this.kAttackAdd1 = 0;
        this.kDefendAdd1 = 0;           

        //Add attribute 2
        this.kHealthAdd2 = 0;
        this.kQiAdd2 = 0;
        this.kAttackAdd2 = 0;
        this.kDefendAdd2 = 0; 
        
        //Add attribute 3
        this.kHealthAdd3 = 0;
        this.kQiAdd3 = 0;
        this.kAttackAdd3 = 0;
        this.kDefendAdd3 = 0; 

        //Init large bg
        let hLargeBg = new engine.TextureRenderable(this.kLargeBg);
        hLargeBg.getXform().setSize(178, 100);
        hLargeBg.getXform().setPosition(89, 50);
        this.mLargeBg = new engine.GameObject(hLargeBg);

        //Init avatar
        let hAvatar = new engine.TextureRenderable(this.kAvatar);
        hAvatar.getXform().setSize(40, 60);
        hAvatar.getXform().setPosition(89, 50);
        this.mAvatar = new engine.GameObject(hAvatar);
        
        //Init text bg
        let hTextFrame = new engine.TextureRenderable(this.kTextBg);
        hTextFrame.getXform().setSize(150,30);
        hTextFrame.getXform().setPosition(89, 67);
        this.mTextBg = new engine.GameObject(hTextFrame);

        //Init name bg
        let hNameFrame = new engine.TextureRenderable(this.kNameBg);
        hNameFrame.getXform().setSize(20,6);
        hNameFrame.getXform().setPosition(24, 40);
        this.mNameBg = new engine.GameObject(hNameFrame);

        //Name text
        this.mNameText = new engine.FontRenderable(this.kNameText);
        this.mNameText.setColor([0.3, 0.6, 0.9, 1]);
        this.mNameText.getXform().setPosition(21,40);
        this.mNameText.setTextHeight(3);   

        //Dialogue text 1
        this.mDialogueText1 = new engine.FontRenderable(this.kDialogueText);
        this.mDialogueText1.setColor([0.3, 0.6, 0.9, 1]);
        this.mDialogueText1.getXform().setPosition(21, 30);
        this.mDialogueText1.setTextHeight(3);    
        
        //Dialogue text 2
        this.mDialogueText2 = new engine.FontRenderable(this.kDialogueText);
        this.mDialogueText2.setColor([0.3, 0.6, 0.9, 1]);
        this.mDialogueText2.getXform().setPosition(21, 30);
        this.mDialogueText2.setTextHeight(3);   
        
         //Dialogue text 3
         this.mDialogueText3 = new engine.FontRenderable(this.kDialogueText);
         this.mDialogueText3.setColor([0.3, 0.6, 0.9, 1]);
         this.mDialogueText3.getXform().setPosition(21, 30);
         this.mDialogueText3.setTextHeight(3);   
         
         //Current Number
         this.mCurrentNumber = 1;

         //Have Option
         this.mHaveOption = false;

         //Option1
         this.mOptionText1 = "";
         this.mOptionNextNumber1 = 2;

         //Option2
         this.mOptionText2 = "";
         this.mOptionNextNumber2 = 2;
         
         //Option3
         this.mOptionText3 = "";
         this.mOptionNextNumber3 = 2; 
         
         //Check wether option is drawn
         this.mIsOptionDrawn = false;

        //Health
        this.mHealth = new engine.FontRenderable(this.kHealth);
        this.mHealth.setColor([0.1, 0.1, 0.1, 1]);
        this.mHealth.getXform().setPosition(10,95);
        this.mHealth.setTextHeight(3);     
        this.mHealth.setText("Health:" + this.kHealthValue);

        //Qi
        this.mQi = new engine.FontRenderable(this.kQi);
        this.mQi.setColor([0.1, 0.1, 0.1, 1]);
        this.mQi.getXform().setPosition(10,90);
        this.mQi.setTextHeight(3);   
        this.mQi.setText("Qi:" + this.kQiValue);        

        //Attack
        this.mAttack = new engine.FontRenderable(this.kAttack);
        this.mAttack.setColor([0.1, 0.1, 0.1, 1]);
        this.mAttack.getXform().setPosition(160,95);
        this.mAttack.setTextHeight(3);     
        this.mAttack.setText("Attack:" + this.kAttackValue);

        //Defend
        this.mDefend = new engine.FontRenderable(this.kDefend);
        this.mDefend.setColor([0.1, 0.1, 0.1, 1]);
        this.mDefend.getXform().setPosition(160,90);
        this.mDefend.setTextHeight(3);   
        this.mDefend.setText("Defend:" + this.kDefendValue); 

        //Effect mode
        this.mEffectMode1 = 0;
        this.mEffectMode2 = 0;
        this.mEffectMode3 = 0;      
        
        //Oscillate player
        this.mOscillatePlayer = null;
        this.kWidth = 40;
        this.kHeight = 60;
    }

    getXform() { 
        return this.mRenderComponent.getXform(); 
    }

    setVisibility(f) { 
        this.mVisible = f; 
    }

    isVisible() { 
        return this.mVisible; 
    }

    getRenderable() { 
        return this.mRenderComponent; 
    }

    update() {
        // simple default behavior
        //let pos = this.getXform().getPosition();

        //console.log("this.mCurrentNumber:" + (this.mCurrentNumber - 1));

        if(this.mOscillatePlayer !== null){
            console.log("Start oscillating");

            if(this.mOscillatePlayer.done()){
                this.stopOscillatePlayer();
                this.mAvatar.getXform().setSize(this.kWidth, this.kHeight);

                console.log("When done, Avatar size:" + this.mAvatar.getXform().getSize());
            }
            else{
                let s = this.mOscillatePlayer.getNext();
                this.mAvatar.getXform().setSize(this.kWidth + s[0], this.kHeight + s[1]);
                
                console.log("During oscillating, Avatar size:" + this.mAvatar.getXform().getSize());
            }
        }
    }

    draw(cam) {
        if (this.isVisible()) {
            this.mLargeBg.draw(cam);
            this.mAvatar.draw(cam);
            this.mTextBg.draw(cam);
            this.mNameBg.draw(cam);
            this.mNameText.draw(cam);
            this.mDialogueText1.draw(cam);
            this.mDialogueText2.draw(cam);
            this.mDialogueText3.draw(cam);

            //Player's attribute
            // this.mHealth.draw(cam);
            // this.mQi.draw(cam);
            // this.mAttack.draw(cam);
            // this.mDefend.draw(cam);

            //Draw Button
            if(this.mHaveOption && (!this.mIsOptionDrawn)){
                this.drawOption(this.mOptionText1, this.mOptionText2, this.mOptionText3);
                this.mIsOptionDrawn = true;
            }
        }
    }

    drawOption(optTex1, optTex2, optTex3){
        //Button 1
        //console.log("button1 = " + n);
        
       // if(typeof button1 === 'undefined'){    
            let button1 = document.createElement('button');
            button1.textContent = optTex1;
            button1.setAttribute('id', 'button1');
            button1.setAttribute('class', 'my-button');
            button1.style.fontSize = '30px';
            button1.style.width = '593px';
            button1.style.height = '100px';
            button1.style.position = 'absolute';
            button1.style.left = '593px';
            button1.style.top = '200px';
            document.body.appendChild(button1);   

            console.log("Draw option1");

            //Make ParentNode global;
            window.buttonParentNode1 = document.body;
            window.button1 = button1;
       // }
 
        //Button 2
       // if(typeof button2 === 'undefined'){
            let button2 = document.createElement('button');
            button2.textContent = optTex2;
            button2.setAttribute('id', 'button2');
            button2.setAttribute('class', 'my-button');
            button2.style.fontSize = '30px';
            button2.style.width = '593px';
            button2.style.height = '100px';
            button2.style.position = 'absolute';
            button2.style.left = '593px';
            button2.style.top = '350px';
            document.body.appendChild(button2);
            //buttonParentNode.appendChild(button2);

            //Make ParentNode global;
            window.button2 = button2;            
       // }


        //Button 3
      //  if(typeof button3 === 'undefined'){
            let button3 = document.createElement('button');
            button3.textContent = optTex3;
            button3.setAttribute('id', 'button3');
            button3.setAttribute('class', 'my-button');
            button3.style.fontSize = '30px';
            button3.style.width = '593px';
            button3.style.height = '100px';
            button3.style.position = 'absolute';
            button3.style.left = '593px';
            button3.style.top = '500px';
            document.body.appendChild(button3);    
            //buttonParentNode.appendChild(button3);

            //Make ParentNode global;
            window.button3 = button3;                 
      //  }       
    }

    setLargeBg(larBg){
        let hLargeBg = new engine.TextureRenderable(larBg);
        hLargeBg.getXform().setSize(178, 100);
        hLargeBg.getXform().setPosition(89, 50);
        this.mLargeBg = new engine.GameObject(hLargeBg);
    }

    setAvatar(ava){
        let hAvatar = new engine.TextureRenderable(ava);
        hAvatar.getXform().setSize(40, 60);
        hAvatar.getXform().setPosition(89, 67);
        this.mAvatar = new engine.GameObject(hAvatar);
    }

    setTextBg(texBg){
        let hTextFrame = new engine.TextureRenderable(texBg);
        hTextFrame.getXform().setSize(150,30);
        hTextFrame.getXform().setPosition(89, 20);
        this.mTextBg = new engine.GameObject(hTextFrame);
    }

    setNameBg(namBg){
        let hNameFrame = new engine.TextureRenderable(namBg);
        hNameFrame.getXform().setSize(20,6);
        hNameFrame.getXform().setPosition(24, 40);
        this.mNameBg = new engine.GameObject(hNameFrame);
    }

    setNameText(namTex){
        this.mNameText = new engine.FontRenderable(namTex);
        this.mNameText.setColor([1, 0, 0, 1]);
        this.mNameText.getXform().setPosition(21,40);
        this.mNameText.setTextHeight(3);   
    }

    setDialogueText(diaTex1, diaTex2, diaTex3){
        this.mDialogueText1 = new engine.FontRenderable(diaTex1);
        this.mDialogueText1.setColor([1, 1, 1, 1]);
        this.mDialogueText1.getXform().setPosition(21, 30);
        this.mDialogueText1.setTextHeight(3);

        this.mDialogueText2 = new engine.FontRenderable(diaTex2);
        this.mDialogueText2.setColor([0, 1, 0, 1]);
        this.mDialogueText2.getXform().setPosition(21, 20);
        this.mDialogueText2.setTextHeight(3);

        this.mDialogueText3 = new engine.FontRenderable(diaTex3);
        this.mDialogueText3.setColor([1, 0, 1, 1]);
        this.mDialogueText3.getXform().setPosition(21, 10);
        this.mDialogueText3.setTextHeight(3);
    }

    setCurrentNumber(curNum){
        this.mCurrentNumber = curNum;
    }

    setHaveOption(havOpt){
        this.mHaveOption = havOpt;
    }

    setOption1(optTex, optNexNum, addHea, addQi, addAtt, addDef, effMod){
        this.mOptionText1 = optTex;
        this.mOptionNextNumber1 = optNexNum;
        
        this.kHealthAdd1 = addHea;
        this.kQiAdd1 = addQi;
        this.kAttackAdd1 = addAtt;
        this.kDefendAdd1 = addDef;
        
        this.mEffectMode1 = effMod;
    }

    setOption2(optTex, optNexNum, addHea, addQi, addAtt, addDef, effMod){
        this.mOptionText2 = optTex;
        this.mOptionNextNumber2 = optNexNum;

        this.kHealthAdd2 = addHea;
        this.kQiAdd2 = addQi;
        this.kAttackAdd2 = addAtt;
        this.kDefendAdd2 = addDef;    

        this.mEffectMode2 = effMod;
    }

    setOption3(optTex, optNexNum, addHea, addQi, addAtt, addDef, effMod){
        this.mOptionText3 = optTex;
        this.mOptionNextNumber3 = optNexNum;

        this.kHealthAdd3 = addHea;
        this.kQiAdd3 = addQi;
        this.kAttackAdd3 = addAtt;
        this.kDefendAdd3 = addDef;      

        this.mEffectMode3 = effMod;
    }

    //Oscillate player
    oscillatePlayer(){
        if(this.mOscillatePlayer == null){
            this.mOscillatePlayer = new engine.Oscillate.OscillatePosition(20, 30, 4, 180);            
        }
    }

    stopOscillatePlayer(){
        this.mOscillatePlayer = null;
    }
    
    //Oscillate the position of enermy

    //Oscillate the size of enermy
}

export default Dialogue;