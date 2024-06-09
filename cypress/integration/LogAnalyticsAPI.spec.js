describe('Log Analytics API Tests', () => {
  const baseUrl = 'http://127.0.0.1:8090';

  const makeRequestAndCheckResponse = (method, url, params = {}, expectedStatus = 200, checkResponse = (response) => {}) => {
    cy.request({
      method: method,
      url: url,
      qs: params,
      failOnStatusCode: false,
    }).then((response) => {
      cy.log('Status:', response.status);
      cy.log('Body:', response.body);
      expect(response.status).to.eq(expectedStatus);
      checkResponse(response);
    });
  };

  const checkCounterProperty = (response) => {
    expect(response.body).to.have.property('counter');
  };

  it('should get the current count without parameters', () => {
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, {}, 200, checkCounterProperty);
  });

  it('should get the count with all parameters', () => {
    const params = {
      'serviceNames[]': ['USER-SERVICE', 'INVOICE-SERVICE'],
      startDate: '2017-05-22T00:00:00Z',
      endDate: '2023-05-23T23:59:59Z',
      statusCode: 201,
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 200, checkCounterProperty);
  });

  it('should get the count with only serviceNames parameter', () => {
    const params = {
      'serviceNames[]': ['USER-SERVICE'],
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 200, checkCounterProperty);
  });

  it('should get the count with only startDate parameter', () => {
    const params = {
      startDate: '2017-05-22T00:00:00Z',
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 200, checkCounterProperty);
  });

  it('should get the count with only endDate parameter', () => {
    const params = {
      endDate: '2023-05-23T23:59:59Z',
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 200, checkCounterProperty);
  });

  it('should get the count with only statusCode parameter', () => {
    const params = {
      statusCode: 201,
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 200, checkCounterProperty);
  });

  it('should get 400 with status code 0', () => {
    const params = {
      'serviceNames[]': ['USER-SERVICE', 'INVOICE-SERVICE'],
      startDate: '2017-05-22T00:00:00Z',
      endDate: '2023-05-23T23:59:59Z',
      statusCode: 0,
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 400, (response) => {
      expect(response.body).to.have.property('detail').and.to.be.an('array');
      expect(response.body.detail[0]).to.include('It must be between 100 and 599');
    });
  });

  it('should get 400 with empty serviceNames array', () => {
    const params = {
      'serviceNames[]': [],
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 400, (response) => {
      expect(response.body).to.have.property('title').that.includes('Validation failed.');
      expect(response.body).to.have.property('detail').and.to.be.an('array');
      expect(response.body.detail[0]).to.include('Provided Service Name Cannot be empty');
    });
  });

  it('should get 503 with invalid startDate format', () => {
    const params = {
      startDate: '123',
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 503, (response) => {
      expect(response.body).to.have.property('title').that.includes('Something went wrong.');
    });
  });

  it('should get 503 with invalid endDate format', () => {
    const params = {
      endDate: '123',
    };
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, params, 503, (response) => {
      expect(response.body).to.have.property('title').that.includes('Something went wrong.');
    });
  });

  it('should reset the count to zero', () => {
    makeRequestAndCheckResponse('DELETE', `${baseUrl}/truncate`, {}, 204);
    makeRequestAndCheckResponse('GET', `${baseUrl}/count`, {}, 200, (response) => {
      expect(response.body).to.have.property('counter');
      expect(response.body.counter).to.eq(0);
    });
  });

  it('should get 400 when trying to truncate with a bad parameter', () => {
    const params = {
      badParam: 'invalid',
    };
    makeRequestAndCheckResponse('DELETE', `${baseUrl}/truncate`, params, 400, (response) => {
      expect(response.body).to.have.property('title').that.includes('Bad input parameter.');
    });
  });
});
