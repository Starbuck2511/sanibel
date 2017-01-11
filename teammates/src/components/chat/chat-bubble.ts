import {Component} from '@angular/core';

@Component({
    selector: 'chat-bubble',
    inputs: ['message: message'],
    template: `
  <div class="chatBubble">    
    <div class="chat-bubble {{message.position}}">
      <div class="message">{{message.content}}</div>
      <div class="message-detail">
          <span style="font-weight:bold;">{{message.name}} </span>,
          <span>{{message.timestamp}}</span>
      </div>
    </div>
  </div>
  `
})
export class ChatBubble {
    constructor() {

    }
}