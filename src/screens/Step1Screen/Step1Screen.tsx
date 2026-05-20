import React, {useEffect, useMemo, useState} from 'react';
import CustomCollapse from '../../components/CustomCollapse/CustomCollapse';
import {CollapseSingleType} from '../../components/CustomCollapse/CustomCollapse.type';
import detailsFormArray from '../../utils/DetailsFormFields';
import {Condition, Option} from '../../utils/FormFields.type';
import {groupBy} from '../../utils/generalFunction';

const Step1Screen = () => {
  const [detailsFormArrayFiltered, setDetailsFormArrayFiltered] = useState<
    CollapseSingleType[]
  >([]);

  // קיבוץ הנתונים לפי collapseTitle
  const detailsFormArrayBeforeFiltered: CollapseSingleType[] = useMemo(
    () => groupBy(detailsFormArray, 'collapseTitle'),
    [],
  );

  // טעינה ראשונית
  useEffect(() => {
    setDetailsFormArrayFiltered([...detailsFormArrayBeforeFiltered]);
  }, [detailsFormArrayBeforeFiltered]);

  // לחיצה על אופציה (סינון דינמי של השדות)
  const handlePress = (option?: Option) => {
    const newArray: CollapseSingleType[] =
      detailsFormArrayBeforeFiltered.map(
        (section: CollapseSingleType) => {
          const filteredData = section.data?.filter(field => {
            // אם יש תנאים – בודקים התאמה
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

    setDetailsFormArrayFiltered(newArray);
  };

  return (
    <CustomCollapse
      sections={detailsFormArrayFiltered}
      handlePress={handlePress}
    />
  );
};

export default Step1Screen;
