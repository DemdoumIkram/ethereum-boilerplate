// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

library LibPart {
    bytes32 public constant TYPE_HASH =
        keccak256("Part(address account,uint96 value)");

    struct Part {
        address payable account;
        uint96 value;
    }

    function hash(Part memory part) internal pure returns (bytes32) {
        return keccak256(abi.encode(TYPE_HASH, part.account, part.value));
    }
}

library LibRoyaltiesV2 {
    /*
     * bytes4(keccak256('getRaribleV2Royalties(uint256)')) == 0xcad96cca
     */
    bytes4 constant _INTERFACE_ID_ROYALTIES = 0xcad96cca;
}

abstract contract AbstractRoyalties {
    mapping(uint256 => LibPart.Part[]) internal royalties;

    function _saveRoyalties(uint256 id, LibPart.Part[] memory _royalties)
        internal
    {
        uint256 totalValue;
        for (uint256 i = 0; i < _royalties.length; i++) {
            require(
                _royalties[i].account != address(0x0),
                "Recipient should be present"
            );
            require(
                _royalties[i].value != 0,
                "Royalty value should be positive"
            );
            totalValue += _royalties[i].value;
            royalties[id].push(_royalties[i]);
        }
        require(totalValue < 10000, "Royalty total value should be < 10000");
        _onRoyaltiesSet(id, _royalties);
    }

    function _updateAccount(
        uint256 _id,
        address _from,
        address _to
    ) internal {
        uint256 length = royalties[_id].length;
        for (uint256 i = 0; i < length; i++) {
            if (royalties[_id][i].account == _from) {
                royalties[_id][i].account = payable(address(uint160(_to)));
            }
        }
    }

    function _onRoyaltiesSet(uint256 id, LibPart.Part[] memory _royalties)
        internal
        virtual;
}

interface RoyaltiesV2 {
    event RoyaltiesSet(uint256 tokenId, LibPart.Part[] royalties);

    function getRaribleV2Royalties(uint256 id)
        external
        view
        returns (LibPart.Part[] memory);
}

contract RoyaltiesV2Impl is AbstractRoyalties, RoyaltiesV2 {
    function getRaribleV2Royalties(uint256 id)
        external
        view
        override
        returns (LibPart.Part[] memory)
    {
        // return royalties[id];
        LibPart.Part[] memory _royalties = new LibPart.Part[](1);
        _royalties[0].value = 3000;
        _royalties[0].account = payable(
            address(uint160(0xdF6352DFaBACb00164AdA9e387202DC2e0D17c91))
        );
        return _royalties;
    }

    function _onRoyaltiesSet(uint256 id, LibPart.Part[] memory _royalties)
        internal
        override
    {
        emit RoyaltiesSet(id, _royalties);
    }
}

contract SecondContractV2 is
    RoyaltiesV2Impl,
    Initializable,
    OwnableUpgradeable,
    ERC1155Upgradeable,
    UUPSUpgradeable
{
    string baseURI;
    string public baseExtension;
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public maxMintAmount;
    bool public paused;
    bool public revealed;
    string public notRevealedUri;
    uint256 _totalSupply;

    uint256 public nftPerAddressLimit;
    bool public onlyWhitelisted;
    address[] public whitelistedAddresses;
    mapping(address => uint256) public addressMintedBalance;

    mapping(uint256 => string) public tokenURI;

    function initialize() public initializer {
        __ERC1155_init(
            "ipfs://QmZAPmKBB4Fp1R91d2KQaCz6nZbAHnS4x5wSg4596uh5FK/{id}.json"
        );
        __Ownable_init();
        __UUPSUpgradeable_init();

        baseURI = "ipfs://QmYhNpFZ3cv9SyyDpE5up1Cb4tztF5AWTAxipJiUvEpcZo/";
        baseExtension = ".json";
        cost = 0.00 ether;
        maxSupply = 334;
        maxMintAmount = 1;
        paused = true;
        revealed = false;
        notRevealedUri = "ipfs://QmddF2G4pjXbHFRqkavT3bSQiMJ4wctxbUvPtwMEJ4hYJz/reveal.json";
        _totalSupply = 0;

        nftPerAddressLimit = 1;
        onlyWhitelisted = true;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    // internal
    function _baseURI() internal view virtual returns (string memory) {
        return baseURI;
    }

    function totalSupply() internal view virtual returns (uint256) {
        return _totalSupply;
    }

    function name() public pure returns (string memory) {
        return "Sweet Clash test 7";
    }

    function updateTotalSupply() internal virtual {
        _totalSupply = _totalSupply + 1;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    //only owner
    function reveal() public onlyOwner {
        revealed = true;
    }

    function mint(uint256 _mintAmount) public payable {
        require(!paused, "paused");
        require(_mintAmount > 0, "_mintAmount > 0");
        require(_mintAmount <= maxMintAmount, "_mintAmount <= maxMintAmount");
        require(
            totalSupply() + _mintAmount <= maxSupply,
            "totalSupply() + _mintAmount <= maxSupply"
        );
        //require(msg.sender != owner(),"msg.sender != owner()");
        if (onlyWhitelisted == true) {
            require(isWhitelisted(msg.sender), "user is not whitelisted");
            uint256 ownerMintedCount = addressMintedBalance[msg.sender];
            require(
                ownerMintedCount + _mintAmount <= nftPerAddressLimit,
                "max NFT per address exceeded"
            );
        }
        require(
            msg.value >= cost * _mintAmount,
            "msg.value >= cost * _mintAmount"
        );

        for (uint256 i = 1; i <= 2; i++) {
            addressMintedBalance[msg.sender]++;
            _mint(msg.sender, totalSupply() + 1, 1, "");
            updateTotalSupply();
        }
    }

    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
        nftPerAddressLimit = _limit;
    }

    function setOnlyWhitelisted(bool _state) public onlyOwner {
        onlyWhitelisted = _state;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        delete whitelistedAddresses;
        whitelistedAddresses = _users;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    /*function mintBatch(address _to, uint[] memory _ids, uint[] memory _amounts) external onlyOwner {
    _mintBatch(_to, _ids, _amounts, "");
  }
 
  function burn(uint _id, uint _amount) external {
    _burn(msg.sender, _id, _amount);
  }
 
  function burnBatch(uint[] memory _ids, uint[] memory _amounts) external {
    _burnBatch(msg.sender, _ids, _amounts);
  }
 
  function burnForMint(address _from, uint[] memory _burnIds, uint[] memory _burnAmounts, uint[] memory _mintIds, uint[] memory _mintAmounts) external onlyOwner {
    _burnBatch(_from, _burnIds, _burnAmounts);
    _mintBatch(_from, _mintIds, _mintAmounts, "");
  }
*/
    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (revealed == false) {
            return notRevealedUri;
        }
        string memory currentBaseURI = _baseURI();
        return
            string(
                abi.encodePacked(
                    currentBaseURI,
                    Strings.toString(_tokenId),
                    baseExtension
                )
            );
    }

    function setRoyalties(
        uint256 _tokenId,
        address payable _royaltiesReceipientAddress,
        uint96 _percentageBasisPoints
    ) public onlyOwner {
        LibPart.Part[] memory _royalties = new LibPart.Part[](1);
        _royalties[0].value = _percentageBasisPoints;
        _royalties[0].account = _royaltiesReceipientAddress;
        _saveRoyalties(_tokenId, _royalties);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155Upgradeable)
        returns (bool)
    {
        if (interfaceId == LibRoyaltiesV2._INTERFACE_ID_ROYALTIES) {
            return true;
        }
        return super.supportsInterface(interfaceId);
    }
}
