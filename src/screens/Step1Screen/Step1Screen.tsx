
import React, { useEffect, useState } from 'react';
import CustomCollapse from '../../components/CustomCollapse/CustomCollapse';
import { CollapseSingleType } from '../../components/CustomCollapse/CustomCollapse.type';
import detailsFormArray from '../../utils/DetailsFormFields';
import { Option } from '../../utils/FormFields.type';
import { groupBy } from '../../utils/generalFunction';

const Step1Screen = () => {
  const [detailsFormArrayFiltered, setDetailsFormArrayFiltered] = useState<CollapseSingleType[]>([]);
  const detailsFormArrayBeforeFiltered = groupBy(detailsFormArray, "collapseTitle")

  useEffect(() => {
    setDetailsFormArrayFiltered(detailsFormArrayBeforeFiltered)
  }, [])

  const handlePress = (option?: Option) => {
    let newArray: any = [];

    detailsFormArrayBeforeFiltered.filter((item: CollapseSingleType) => {
      const filteredData = item?.data?.filter((itemDataField) => {
        if (itemDataField?.condition?.length) {
          return itemDataField?.condition?.find((itemCondition: any) => {
            return itemCondition.fieldId === option?.name && itemCondition.value === option?.id.toString();
          });
        } else {
          return itemDataField;
        }
      });
      item.data = filteredData
      newArray.push(item)
    });

    setDetailsFormArrayFiltered(newArray);
  }

  return (
    <CustomCollapse
      sections={detailsFormArrayFiltered}
      handlePress={handlePress}
    />
  );
};

export default Step1Screen;




