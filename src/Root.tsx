import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CreditVideo, CREDIT_VIDEO_FRAMES} from './CreditVideo';

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
        durationInFrames={CREDIT_VIDEO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
