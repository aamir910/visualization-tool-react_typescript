import React from 'react';
import { Card } from 'antd';

import styles from '../styles/VisualizationCard.module.css';

interface VisualizationCardProps {
  name: string;
  image: string;
  onClick: () => void;
}

const VisualizationCard: React.FC<VisualizationCardProps> = ({ name, image, onClick }) => {
  return (
    <Card
      hoverable
      className={styles.card}
      style={{ width: 300, margin: '10px' }}
      cover={<img alt={name} src={image} />}
      onClick={onClick}
    >
      <Card.Meta title={name} />
    </Card>
  );
};

export default VisualizationCard;
