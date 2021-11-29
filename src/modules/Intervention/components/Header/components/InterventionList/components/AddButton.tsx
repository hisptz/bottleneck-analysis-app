import { Button, IconAdd24 } from "@dhis2/ui";
import React from "react";
import styles from "../styles.module.css";

export default function AddButton({ onClick }: { onClick: () => void }) {
  return <Button onClick={onClick} className={styles.circular} icon={<IconAdd24 />} />;
}
