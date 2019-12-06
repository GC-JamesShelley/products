import moment from 'moment';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import { baseSpace, mobileBreakpoint } from '../../styles/dimensions';
import MipText from '../mip-text';
import Search from '../search';
import SearchResults, { IDocument } from '../search-results';
import YellowCard from '../yellow-card';
import { azureSearch, IAzureSearchResult } from './azure-search';
const Aside = styled.aside`
  max-width: 25%;
  padding: ${baseSpace} calc(${baseSpace} / 2) 0 ${baseSpace};

  @media ${mobileBreakpoint} {
    max-width: 100%;
    padding: 0.3125rem;

    .yellow-card-wrapper {
      display: none;
    }
  }
`;

const Main = styled.main`
  max-width: 75%;
  padding: ${baseSpace};
  padding-left: calc(${baseSpace} / 2);

  .yellow-card-wrapper {
    display: none;
  }

  @media ${mobileBreakpoint} {
    max-width: 100%;

    .yellow-card-wrapper {
      display: block;
    }
  }
`;

const sanitizeTitle = (title: string | null): string => {
  let name: string;
  if (!title) return 'Unknown';

  try {
    name = decodeURIComponent(title);
  } catch {
    name = title;
  }
  return name;
};

const Mip: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [showingResultsForTerm, setShowingResultsForTerm] = React.useState('');
  const [results, setResults] = React.useState<IDocument[]>([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [resultCount, setResultCount] = React.useState(0);
  const pageSize = 20;
  const router = useRouter();
  const {
    query: { search: searchTerm, page },
  } = router;

  const handleSearchChange = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearch(e.currentTarget.value);

    if (search.length > 0) {
      router.push({
        pathname: '/',
        query: { search, page: 1 },
      });
    }
  };

  const fetchSearchResults = async (searchTerm: string, page: number) => {
    const searchResults = await azureSearch(searchTerm, page, pageSize);
    const results = searchResults.results.map((doc: IAzureSearchResult) => {
      return {
        activeSubstances: doc.substance_name,
        context: doc['@search.highlights']?.content.join(' … ') || '',
        docType: doc.doc_type?.toString().substr(0, 3) || '',
        fileSize: Math.ceil(
          doc.metadata_storage_size ? doc.metadata_storage_size : 0 / 1000,
        ).toLocaleString('en-GB'),
        created: doc.created
          ? moment(doc.created).format('DD MMMM YYYY')
          : 'Unknown',
        name: sanitizeTitle(doc.title),
        url: doc.metadata_storage_path,
      };
    });
    setResults(results);
    setResultCount(searchResults.resultCount);
    setShowingResultsForTerm(searchTerm);
  };

  useEffect(() => {
    if (searchTerm && page) {
      if (typeof searchTerm === 'string') {
        setSearch(searchTerm);
        let parsedPage = Number(page);
        if (!parsedPage || parsedPage < 1) {
          parsedPage = 1;
        }
        setPageNumber(parsedPage);
        fetchSearchResults(searchTerm, parsedPage);
      }
    }
  }, [searchTerm]);

  return (
    <>
      <Aside>
        <Search
          search={search}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className="yellow-card-wrapper">
          <YellowCard />
        </div>
      </Aside>
      {showingResultsForTerm.length === 0 ? (
        <Main>
          <MipText />
          {/* <DrugIndex /> */}
          <div className="yellow-card-wrapper">
            <YellowCard />
          </div>
        </Main>
      ) : (
        <Main>
          <SearchResults
            drugs={results}
            showingResultsForTerm={showingResultsForTerm}
            resultCount={resultCount}
            page={pageNumber}
            pageSize={pageSize}
            searchTerm={search}
          />
          <div className="yellow-card-wrapper">
            <YellowCard />
          </div>
        </Main>
      )}
    </>
  );
};

export default Mip;
