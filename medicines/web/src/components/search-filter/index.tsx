import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { RerouteType } from '../../model/rerouteType';
import { DocType } from '../../services/azure-search';

const StyledSearchFilter = styled.section`
  .checkbox-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 0.25em;

    .checkbox {
      flex: 0.1;
      display: flex;
      flex-direction: column;
      padding: 0.25em;

      input {
        flex: 1;
      }
    }

    label {
      flex: 1;
    }
  }
`;

interface ISearchFilterProps {
  currentlyEnabledDocTypes: DocType[];
  updateDocTypes: (d: DocType[]) => void;
  rerouteType: RerouteType;
}

interface IDocTypeCheckboxProps {
  docTypeForThisCheckbox: DocType;
  name: string;
  toggleDocType: (d: DocType) => void;
  currentlyEnabledDocTypes: DocType[];
}

const DocTypeCheckbox: React.FC<IDocTypeCheckboxProps> = props => {
  const {
    docTypeForThisCheckbox,
    name,
    toggleDocType,
    currentlyEnabledDocTypes,
  } = props;

  const toggleDocTypeForThisCheckbox = () =>
    toggleDocType(docTypeForThisCheckbox);

  const id = `filter-${docTypeForThisCheckbox.toLowerCase()}`;

  return (
    <div className="checkbox-row">
      <div className="checkbox">
        <input
          type="checkbox"
          id={id}
          name="doc"
          value={docTypeForThisCheckbox}
          checked={currentlyEnabledDocTypes.includes(docTypeForThisCheckbox)}
          onChange={toggleDocTypeForThisCheckbox}
        />
      </div>
      <label htmlFor={id}>
        {name} ({docTypeForThisCheckbox.toUpperCase()})
      </label>
    </div>
  );
};

const SearchFilter: React.FC<ISearchFilterProps> = props => {
  const [checkedFilters, setCheckedFilters] = React.useState(
    props.currentlyEnabledDocTypes,
  );
  const submitButton = useRef(null);

  const generateCheckboxFor = (docType: DocType, name: string) => (
    <DocTypeCheckbox
      toggleDocType={toggleDocType}
      currentlyEnabledDocTypes={checkedFilters}
      docTypeForThisCheckbox={docType}
      name={name}
    />
  );

  const toggleDocType = docTypeToToggle => {
    const enabledDocTypes = Array.from(checkedFilters);
    if (enabledDocTypes.includes(docTypeToToggle)) {
      const docTypeIndex = enabledDocTypes.indexOf(docTypeToToggle);
      enabledDocTypes.splice(docTypeIndex, 1);
    } else {
      enabledDocTypes.push(docTypeToToggle);
    }
    setCheckedFilters(enabledDocTypes);
  };

  const submit = e => {
    e.preventDefault();
    props.updateDocTypes(checkedFilters);
  };

  useEffect(() => {
    if (
      RerouteType[props.rerouteType.toString()] === RerouteType.CheckboxSelected
    ) {
      submitButton.current.focus();
    }
  }, [props.rerouteType]);

  return (
    <StyledSearchFilter>
      <h2>Filter documents by</h2>
      {generateCheckboxFor(DocType.Spc, 'Summary of Product Characteristics')}
      {generateCheckboxFor(DocType.Pil, 'Patient Information Leaflet')}
      {generateCheckboxFor(DocType.Par, 'Public Assessment Reports')}
      <input type="submit" onClick={submit} value="submit" ref={submitButton} />
    </StyledSearchFilter>
  );
};

export default SearchFilter;
