import React, {useEffect, useMemo, useState} from 'react';
import matchFormArray from '../../utils/MatchFormFields';
import CustomCollapse from '../../components/CustomCollapse/CustomCollapse';
import {groupBy} from '../../utils/generalFunction';
import {CollapseSingleType} from '../../components/CustomCollapse/CustomCollapse.type';
import {Condition, Option} from '../../utils/FormFields.type';

const Step2Screen = () => {
  const [matchFormArrayFiltered, setMatchFormArrayFiltered] = useState<
    CollapseSingleType[]
  >([]);

  // קיבוץ ראשוני לפי collapseTitle
  const matchFormArrayBeforeFiltered: CollapseSingleType[] = useMemo(
    () => groupBy(matchFormArray, 'collapseTitle'),
    [],
  );

  // טעינה ראשונית
  useEffect(() => {
    setMatchFormArrayFiltered([...matchFormArrayBeforeFiltered]);
  }, [matchFormArrayBeforeFiltered]);

  // לחיצה על אופציה – סינון דינמי
  const handlePress = (option?: Option) => {
    const newArray: CollapseSingleType[] =
      matchFormArrayBeforeFiltered.map(
        (section: CollapseSingleType) => {
          const filteredData = section.data?.filter(field => {
            // אם יש תנאים – בדיקה
            if (field?.condition?.length) {
              return field.condition.some((condition: Condition) =>
                condition.fieldId === option?.name &&
                condition.value === String(option?.id),
              );
            }

            // אם אין תנאים – תמיד מוצג
            return true;
          });

          return {
            ...section,
            data: filteredData,
          };
        },
      );

    setMatchFormArrayFiltered(newArray);
  };

  return (
    <CustomCollapse
      sections={matchFormArrayFiltered}
      handlePress={handlePress}
    />
  );
};

export default Step2Screen;
