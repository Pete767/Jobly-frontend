import React, { Component } from 'react';
import Search from "./Search";
import CompanyCard from "./CompanyCard";
import JoblyApi from "./JoblyApi";
import { Redirect } from "react-router-dom";
import UserContext from './UserContext';

class Companies extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      loading: true
    }
    this.handleCompanySearch = this.handleCompanySearch.bind(this);
  }

  async componentDidMount() {
    const currUser = this.context;
    if (currUser) {
      try {
        let companies = await JoblyApi.getCompanies();
        this.setState({ companies, loading: false })
      } catch (err) {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }
  }

  // {search, min_employees, max_employees} => 
  async handleCompanySearch(searchTerms) {
    this.setState({ loading: true }, async function () {
      let companies = await JoblyApi.getCompanies(searchTerms);
      this.setState({ companies, loading: false });
    })
  }

  render() {

    const currUser = this.context;
    if (this.state.loading === true) {
      return <p>Loading...</p>
    } else {
      if (!currUser) {
        return <Redirect to={{
          pathname: '/login',
          state: { needsLogin: true }
        }} />
      }
    }

    const companies = this.state.companies.map(company =>
      <CompanyCard name={company.name}
        description={company.description}
        logo_url={company.logo_url}
        handle={company.handle}
        key={company.handle} />);

    return (
      <div>
        <Search searchFor="companies" searchCompanies={this.handleCompanySearch} />
        {companies}
      </div>
    );
  }
}

export default Companies;