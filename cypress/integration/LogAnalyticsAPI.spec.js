describe('Log Analytics API Tests', () => {
  const baseUrl = 'http://127.0.0.1:8090';

  it('should get the current count without parameters', () => {
    cy.request('GET', `${baseUrl}/count`).then((response) => {
      if (response.status === 200) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('counter');
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get the count with all parameters', () => {
    const params = {
      'serviceNames[]': ['USER-SERVICE', 'INVOICE-SERVICE'],
      startDate: '2017-05-22T00:00:00Z',
      endDate: '2023-05-23T23:59:59Z',
      statusCode: 201
    };

    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
    }).then((response) => {
      if (response.status === 200) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('counter');
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get the count with only serviceNames parameter', () => {
    const params = {
      'serviceNames[]': ['USER-SERVICE']
    };

    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('counter');
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get the count with only startDate parameter', () => {
    const params = {
      startDate: '2017-05-22T00:00:00Z'
    };

    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('counter');
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get the count with only endDate parameter', () => {
    const params = {
      endDate: '2023-05-23T23:59:59Z'
    };

    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('counter');
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get the count with only statusCode parameter', () => {
    const params = {
      statusCode: 201
    };

    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('counter');
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get 400 with status code 0', () => {
    const params = {
      'serviceNames[]': ['USER-SERVICE', 'INVOICE-SERVICE'],
      startDate: '2017-05-22T00:00:00Z',
      endDate: '2023-05-23T23:59:59Z',
      statusCode: 0
    };

    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 400) {
        cy.log('Response body:', response.body);
        expect(response.body).to.have.property('detail').and.to.be.an('array');
        expect(response.body.detail[0]).to.include('It must be between 100 and 599');
        cy.log('Response body:', response.body);
      } else {
        cy.log('Status:', response.status);
        cy.log('Body:', response.body);
      }
    });
  });

  it('should get 400 with empty serviceNames array', () => {
    const params = {
      'serviceNames[]': [],
    };
  
    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('title').that.includes('Validation failed.');
      expect(response.body).to.have.property('detail').and.to.be.an('array');
      expect(response.body.detail[0]).to.include('Provided Service Name Cannot be empty');
      cy.log('Response body:', response.body);
    });
  });

  it('should get 503 with invalid startDate format', () => {
    const params = {
      startDate: '123',
    };
  
    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(503);
      expect(response.body).to.have.property('title').that.includes('Something went wrong.');
      cy.log('Response body:', response.body);
    });
  });

  it('should get 503 with invalid endDate format', () => {
    const params = {
      endDate: '123',
    };
  
    cy.request({
      method: 'GET',
      url: `${baseUrl}/count`,
      qs: params,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(503);
      expect(response.body).to.have.property('title').that.includes('Something went wrong.');
      cy.log('Response body:', response.body);
    });
  });
  
  it('should reset the count to zero', () => {
    cy.request('DELETE', `${baseUrl}/truncate`).then((response) => {
      expect(response.status).to.eq(204);
    });
  
    cy.request('GET', `${baseUrl}/count`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('counter');
      expect(response.body.counter).to.eq(0);
    });
  });
  
});