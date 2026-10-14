import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {AvaFilm} from './ava/AvaFilm';
import {CreditVideo, CREDIT_SECONDS} from './credit/CreditVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CreditVideo"
        component={CreditVideo}
        durationInFrames={CREDIT_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="AvaMAS-16x9" component={AvaFilm} durationInFrames={1800} fps={30} width={1920} height={1080} defaultProps={{orient: 'landscape' as const}} />
      <Composition id="AvaMAS-9x16" component={AvaFilm} durationInFrames={1800} fps={30} width={1080} height={1920} defaultProps={{orient: 'portrait' as const}} />
    </>
  );
};
