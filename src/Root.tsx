import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CreditVideo, CREDIT_SECONDS} from './credit/CreditVideo';
import {PitchVideo} from './pitch/PitchVideo';
import {STORIES, storySeconds} from './pitch/data';

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
      {STORIES.map((story) => (
        <Composition
          key={story.id}
          id={story.id}
          component={PitchVideo}
          defaultProps={{story}}
          durationInFrames={Math.round(storySeconds(story) * 30)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
    </>
  );
};
