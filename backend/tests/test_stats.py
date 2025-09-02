"""Test gene statistics functionality"""


def test_get_stats_empty_database(client):
    """Test statistics with empty database"""
    response = client.get("/api/v1/genes/stats/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_genes"] == 0
    assert data["chromosomes"] == []
    assert data["biotypes"] == []


def test_get_stats_with_data(client, sample_genes):
    """Test statistics with sample data"""
    response = client.get("/api/v1/genes/stats/summary")
    assert response.status_code == 200
    data = response.json()

    assert data["total_genes"] == 3
    assert "13" in data["chromosomes"]
    assert "17" in data["chromosomes"]
    assert "protein_coding" in data["biotypes"]

    # Should be sorted
    assert data["chromosomes"] == ["13", "17"]
    assert data["biotypes"] == ["protein_coding"]


def test_stats_structure(client, sample_genes):
    """Test the structure of statistics response"""
    response = client.get("/api/v1/genes/stats/summary")
    assert response.status_code == 200
    data = response.json()

    # Check required fields exist
    assert "total_genes" in data
    assert "chromosomes" in data
    assert "biotypes" in data

    # Check data types
    assert isinstance(data["total_genes"], int)
    assert isinstance(data["chromosomes"], list)
    assert isinstance(data["biotypes"], list)


def test_stats_chromosome_uniqueness(client, sample_genes):
    """Test that chromosomes are unique in stats"""
    response = client.get("/api/v1/genes/stats/summary")
    assert response.status_code == 200
    data = response.json()

    chromosomes = data["chromosomes"]
    assert len(chromosomes) == len(set(chromosomes))  # Should be unique


def test_stats_biotype_uniqueness(client, sample_genes):
    """Test that biotypes are unique in stats"""
    response = client.get("/api/v1/genes/stats/summary")
    assert response.status_code == 200
    data = response.json()

    biotypes = data["biotypes"]
    assert len(biotypes) == len(set(biotypes))  # Should be unique
