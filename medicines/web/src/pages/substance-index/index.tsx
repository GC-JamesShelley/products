import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { JsonLd } from 'react-schemaorg';
import { ItemList } from 'schema-dts';
import DrugIndex from '../../components/drug-index/index';
import Page from '../../components/page';
import SearchWrapper from '../../components/search-wrapper';
import { SubstanceListStructuredData } from '../../components/structured-data';
import { useLocalStorage } from '../../hooks';
import { ISubstance } from '../../model/substance';
import Events from '../../services/events';
import substanceLoader from '../../services/substance-loader';

const App: NextPage = () => {
  const [storageAllowed, setStorageAllowed] = useLocalStorage(
    'allowStorage',
    false,
  );
  const [results, setResults] = React.useState<ISubstance[]>([]);
  const [substanceIndex, setSubstanceIndex] = React.useState();

  const router = useRouter();
  const {
    query: { query: queryQS },
  } = router;

  useEffect(() => {
    if (!queryQS) {
      return;
    }
    (async () => {
      const index = queryQS.toString();
      setResults(await substanceLoader.load(index));
      setSubstanceIndex(index);
      Events.viewSubstancesStartingWith(index);
    })();
  }, [queryQS]);

  useEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Page
      title="Products"
      storageAllowed={storageAllowed}
      setStorageAllowed={setStorageAllowed}
    >
      <SearchWrapper initialSearchValue="">
        <DrugIndex title={`${substanceIndex || '...'}`} items={results} />
        <SubstanceListStructuredData
          substanceNames={results.map(substance => substance.name)}
        />
      </SearchWrapper>
    </Page>
  );
};

export default App;
