import async from "async";
import { useCallback, useRef, useState } from "react";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";

export default function useQueue({ drain, task }: { drain: () => void; task: (interventionConfig: InterventionConfig) => Promise<any> }) {
  const [progress, setProgress] = useState(0);
  const queue = useRef(
    async.queue((variable: InterventionConfig, callback) => {
      task(variable).then((results) => {
        callback(results);
      });
    }, 1),
  );

  queue.current.drain(drain);
  const add = useCallback((task: InterventionConfig | Array<InterventionConfig>) => {
    queue.current.push(task, (err) => {
      if (err) {
        console.error(err);
      }
      setProgress((prevState) => prevState + 1);
    });
  }, []);

  return {
    add,
    started: queue.current.started,
    kill: queue.current.kill,
    progress,
    length: queue.current.length(),
  };
}
