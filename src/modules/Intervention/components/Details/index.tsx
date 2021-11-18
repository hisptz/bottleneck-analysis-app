import React from "react";
import useInterventionConfig from "../../../../shared/hooks/useInterventionConfig";
import InterventionCard from "../Card";

export default function InterventionDetails() {
  const intervention = useInterventionConfig();

  return (
    <InterventionCard title={<h3 style={{ margin: 2, fontWeight: 500 }}>{intervention.name}</h3>}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in finibus lacus, non imperdiet nulla. Suspendisse potenti. Nunc mattis finibus arcu, non
        mattis purus dapibus id. Donec eu ultrices lorem, at luctus sem. Etiam interdum dui eu sodales posuere. Nulla facilisi. Donec cursus commodo ex, ut
        sodales erat commodo non.
      </p>
    </InterventionCard>
  );
}
