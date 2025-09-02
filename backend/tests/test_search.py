"""Test gene search functionality"""


def test_search_by_symbol_exact(client, sample_genes):
    """Test exact symbol search"""
    response = client.get("/api/v1/genes/search/symbol/BRCA1?exact=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["gene_symbol"] == "BRCA1"
    assert data[0]["ensembl"] == "ENSG00000012048"


def test_search_by_symbol_partial(client, sample_genes):
    """Test partial symbol search"""
    response = client.get("/api/v1/genes/search/symbol/BRCA")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # Should find both BRCA1 and BRCA2
    symbols = [gene["gene_symbol"] for gene in data]
    assert "BRCA1" in symbols
    assert "BRCA2" in symbols


def test_search_by_symbol_not_found(client, sample_genes):
    """Test symbol search with no results"""
    response = client.get("/api/v1/genes/search/symbol/NOTFOUND")
    assert response.status_code == 200
    assert response.json() == []


def test_search_by_symbol_empty(client):
    """Test symbol search with empty string"""
    response = client.get("/api/v1/genes/search/symbol/ ")
    assert response.status_code == 400
    assert "Symbol cannot be empty" in response.json()["detail"]


def test_get_gene_by_ensembl(client, sample_genes):
    """Test getting gene by Ensembl ID"""
    response = client.get("/api/v1/genes/search/ensembl/ENSG00000139618")
    assert response.status_code == 200
    data = response.json()
    assert data["gene_symbol"] == "BRCA2"
    assert data["ensembl"] == "ENSG00000139618"


def test_get_gene_by_ensembl_not_found(client, sample_genes):
    """Test getting gene by non-existent Ensembl ID"""
    response = client.get("/api/v1/genes/search/ensembl/ENSG00000000000")
    assert response.status_code == 404
    assert "Gene not found" in response.json()["detail"]


def test_get_gene_by_ensembl_empty(client):
    """Test getting gene by empty Ensembl ID"""
    response = client.get("/api/v1/genes/search/ensembl/ ")
    assert response.status_code == 400
    assert "Ensembl ID cannot be empty" in response.json()["detail"]


def test_search_by_name_exact(client, sample_genes):
    """Test exact name search"""
    response = client.get("/api/v1/genes/search/name/tumor protein p53?exact=true")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["gene_symbol"] == "TP53"


def test_search_by_name_partial(client, sample_genes):
    """Test partial name search"""
    response = client.get("/api/v1/genes/search/name/BRCA")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # Should find both BRCA genes
    names = [gene["name"] for gene in data]
    assert any("BRCA1" in name for name in names)
    assert any("BRCA2" in name for name in names)


def test_search_by_name_case_insensitive(client, sample_genes):
    """Test case-insensitive name search"""
    response = client.get("/api/v1/genes/search/name/dna repair")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2  # Both BRCA genes have "DNA repair" in name


def test_search_by_name_not_found(client, sample_genes):
    """Test name search with no results"""
    response = client.get("/api/v1/genes/search/name/nonexistent")
    assert response.status_code == 200
    assert response.json() == []


def test_search_by_name_empty(client):
    """Test name search with empty string"""
    response = client.get("/api/v1/genes/search/name/ ")
    assert response.status_code == 400
    assert "Name cannot be empty" in response.json()["detail"]
