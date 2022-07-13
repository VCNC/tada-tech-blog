import { css } from '@emotion/react'

export enum Typeface {
  Headline1Medium = 'Headline1Medium',
  Headline2Medium = 'Headline2Medium',
  Headline3Medium = 'Headline3Medium',
  Headline4Medium = 'Headline4Medium',
  Headline5Medium = 'Headline5Medium',
  Headline1Bold = 'Headline1Bold',
  Headline3Bold = 'Headline3Bold',
  Headline5Bold = 'Headline5Bold',

  Body1Regular = 'Body1Regular',
  Body2Regular = 'Body2Regular',
  Body3Regular = 'Body3Regular',
  Body3Medium = 'Body3Medium',
  Body1Bold = 'Body1Bold',
  Body2Bold = 'Body2Bold',
  Body3Bold = 'Body3Bold',

  Small1Regular = 'Small1Regular',
  Small2Regular = 'Small2Regular',
  Small1Bold = 'Small1Bold',
  Small2Bold = 'Small2Bold',
}

export const Typefaces = {
  [Typeface.Headline1Medium]: css`
    font-size: 40px;
    font-weight: 500;
    line-height: 56px;
  `,
  [Typeface.Headline2Medium]: css`
    font-size: 28px;
    font-weight: 500;
    line-height: 42px;
  `,
  [Typeface.Headline3Medium]: css`
    font-size: 26px;
    font-weight: 500;
    line-height: 41.6px;
  `,
  [Typeface.Headline4Medium]: css`
    font-size: 24px;
    font-weight: 500;
    line-height: 38.4px;
  `,
  [Typeface.Headline5Medium]: css`
    font-size: 20px;
    font-weight: 500;
    line-height: 32px;
  `,
  [Typeface.Headline1Bold]: css`
    font-size: 40px;
    font-weight: 700;
    line-height: 56px;
  `,
  [Typeface.Headline3Bold]: css`
    font-size: 26px;
    font-weight: 700;
    line-height: 41.6px;
  `,
  [Typeface.Headline5Bold]: css`
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
  `,
  [Typeface.Body1Regular]: css`
    font-size: 16px;
    font-weight: 400;
    line-height: 28.8px;
  `,
  [Typeface.Body2Regular]: css`
    font-size: 15px;
    font-weight: 400;
    line-height: 25.5px;
  `,
  [Typeface.Body3Regular]: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 25.2px;
  `,
  [Typeface.Body3Medium]: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 25.2px;
  `,
  [Typeface.Body1Bold]: css`
    font-size: 16px;
    font-weight: 700;
    line-height: 28.8px;
  `,
  [Typeface.Body2Bold]: css`
    font-size: 15px;
    font-weight: 700;
    line-height: 25.5px;
  `,
  [Typeface.Body3Bold]: css`
    font-size: 14px;
    font-weight: 700;
    line-height: 25.2px;
  `,
  [Typeface.Small1Regular]: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 21.6px;
  `,
  [Typeface.Small2Regular]: css`
    font-size: 10px;
    font-weight: 400;
    line-height: 18px;
  `,
  [Typeface.Small1Bold]: css`
    font-size: 12px;
    font-weight: 700;
    line-height: 21.6px;
  `,
  [Typeface.Small2Bold]: css`
    font-size: 10px;
    font-weight: 700;
    line-height: 18px;
  `,
}
