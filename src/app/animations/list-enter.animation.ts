import {
  trigger,
  transition,
  query,
  style,
  stagger,
  group,
  animate
} from '@angular/animations';

export const listEnterAnimation = trigger('listEnter', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateX(-20%)'
        }),
        stagger(100, [
          group([
            animate(
              '400ms ease-out',
              style({
                opacity: 1,
                offset: 1
              })
            ),
            animate(
              '300ms ease-out',
              style({
                transform: 'translateX(0)'
              })
            )
          ])
        ])
      ],
      { optional: true }
    )
  ])
]);
