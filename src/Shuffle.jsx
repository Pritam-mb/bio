import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import './Shuffle.css';

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const resolveRandom = (not = []) => {
  let resolve = '';
  let random = '';
  do {
    random = chars[Math.floor(Math.random() * chars.length)];
    resolve = not.includes(random) ? resolveRandom(not) : random;
  } while (not.includes(random));
  return resolve;
};

const getNotResolved = (word) =>
  word.split('').map((letter) => (letter === ' ' ? ' ' : resolveRandom()));

const getAnimateWord = (word) => {
  const notResolved = getNotResolved(word);
  return word
    .split('')
    .map((letter, i) =>
      letter === ' '
        ? ' '
        : `<span class="shuffle-letter">${notResolved[i]}</span>`,
    )
    .join('');
};

const getAnimateText = (text) =>
  text.split(' ').map((word) => ({
    text: getAnimateWord(word),
    from: word === '' ? [] : word.split(''),
    to: word === '' ? [] : word.split(''),
    word,
  }));

const getDefaultText = (text) =>
  text.split(' ').map((word) => ({
    text: word,
    from: word === '' ? [] : word.split(''),
    to: word === '' ? [] : word.split(''),
    word,
  }));

const Shuffle = ({
  text = 'Portfolio',
  animationDuration = 0.6,
  triggerOnScroll = true,
  as = 'div',
}) => {
  const Tag = as;
  const scope = useRef(null);
  const root = useRef(null);
  const [renderedText, setRenderedText] = useState(() =>
    triggerOnScroll ? getDefaultText(text) : getAnimateText(text),
  );

  useGSAP(
    () => {
      if (!root.current) return;
      const split = SplitText.create('.shuffle-word', {
        type: 'chars,words',
      });

      const iterateWords = (word, timeline, prevEndTime) => {
        const endTime = prevEndTime + animationDuration;

        timeline
          .to(word.words, {
            opacity: 0,
            duration: animationDuration / 2,
            ease: 'power1.out',
            stagger: 0.015,
          })
          .to(word.words, {
            opacity: 1,
            duration: animationDuration / 2,
            ease: 'power1.in',
            stagger: 0.015,
          })
          .to(
            word.words,
            {
              onUpdate: function () {
                const self = this;
                self.targets().forEach((target) => {
                  target.innerHTML = resolveRandom(word.from);
                });
              },
              duration: animationDuration,
            },
            prevEndTime,
          )
          .to(
            word.words,
            {
              onStart: function () {
                const self = this;
                self.targets().forEach((target, i) => {
                  target.innerHTML = word.to[i] || '';
                });
              },
              duration: 0.2,
            },
            endTime,
          );

        return endTime;
      };

      const animate = () => {
        const texts = root.current.querySelectorAll('.shuffle-word');
        const timeline = gsap.timeline({ delay: 0.6 });

        let endTime = 0;
        texts.forEach((text) => {
          const words = split.words.filter((target) =>
            text.contains(target),
          );

          const wordGroups = gsap.utils.toArray(texts);
          const index = wordGroups.indexOf(text);
          const exposedWord = {
            words,
            from: renderedText[index] ? renderedText[index].from : [],
            to: renderedText[index] ? renderedText[index].to : [],
          };

          endTime = iterateWords(exposedWord, timeline, endTime);
        });
      };

      const mouseHandlers = [];
      root.current.querySelectorAll('.shuffle-word').forEach((word) => {
        const handler = () => animate();
        word.addEventListener('mouseenter', handler);
        mouseHandlers.push({ el: word, handler });
      });

      if (triggerOnScroll) {
        const scrollTrigger = ScrollTrigger.create({
          trigger: root.current,
          start: 'top 85%',
          onEnter: animate,
          once: true,
        });
        return () => {
          scrollTrigger.kill();
          mouseHandlers.forEach(({ el, handler }) =>
            el.removeEventListener('mouseenter', handler),
          );
        };
      } else {
        animate();
        return () => {
          mouseHandlers.forEach(({ el, handler }) =>
            el.removeEventListener('mouseenter', handler),
          );
        };
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className="shuffle-container">
      <Tag ref={root} className="shuffle-text">
        {renderedText.map(({ text: word }, i) => (
          <span
            key={i}
            className="shuffle-word"
            dangerouslySetInnerHTML={{ __html: word }}
          />
        ))}
      </Tag>
    </div>
  );
};

export default Shuffle;
