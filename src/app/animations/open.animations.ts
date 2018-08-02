import {
  animate,
  group,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
export const openAnimation = trigger('open', [
  state(
    'in',
    style({
      opacity: 1
    })
  ),
  transition('void => *', [
    style({
      opacity: 0
    }),
    animate(700)
  ]),
  transition('* => void', [
    animate(300),
    style({
      opacity: 0
    })
  ])
]);
