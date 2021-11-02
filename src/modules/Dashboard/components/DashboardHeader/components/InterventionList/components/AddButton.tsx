import { Button, IconAdd24 } from "@dhis2/ui";
import React from "react";
import styles from "../styles.module.css";

export default function AddButton() {
  return <Button className={styles.circular} icon={<IconAdd24 />} />;
}
