import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CreditVideo, CREDIT_SECONDS} from './credit/CreditVideo';
import {Episode, episodeFrames} from './mane/Episode';
import {EPISODES} from './mane/episodes';

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
      {EPISODES.map((d) => (
        <Composition key={d.id} id={d.id} component={Episode} defaultProps={{d}} durationInFrames={episodeFrames(d)} fps={30} width={1080} height={1920} />
      ))}
    </>
  );
};
