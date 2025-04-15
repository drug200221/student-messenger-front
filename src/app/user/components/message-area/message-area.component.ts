import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';

@Component({
  selector: 'psk-message-area',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    MatFormField,
    MatInput,
    MatSuffix,
    MatCard,
    MatCardContent,
    MatCardFooter,
  ],
  templateUrl: './message-area.component.html',
  styleUrl: './message-area.component.scss',
})
export class MessageAreaComponent {

}
