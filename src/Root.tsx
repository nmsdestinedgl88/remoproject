import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {MvVideo, MV_SECONDS} from './mv/MvVideo';
import {MvVideo2, MV2_SECONDS} from './mv/MvVideo2';
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
      <Composition id="MvVideo" component={MvVideo} durationInFrames={MV_SECONDS * 30} fps={30} width={1080} height={1920} />
      <Composition id="MvVideo2" component={MvVideo2} durationInFrames={Math.round(MV2_SECONDS * 30)} fps={30} width={1080} height={1920} />
    </>
  );
};
